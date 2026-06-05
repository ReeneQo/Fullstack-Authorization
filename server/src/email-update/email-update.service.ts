import { randomInt } from 'crypto';
import { type RedisClientType } from 'redis';
import { v4 } from 'uuid';

import { MailService } from '@/libs/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import { REDIS_CLIENT } from '@/redis/redis.module';
import { UpdateUserEmailTokenDto } from '@/user/dto/update-user-email-token.dto';
import { UpdateUserEmailDto } from '@/user/dto/update-user-email.dto';
import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common';

@Injectable()
export class EmailUpdateService {
	private readonly REDIS_EMAIL_UPDATE_KEY_PREFIX = 'email-update';
	private readonly REDIS_EMAIL_UPDATE_CALLBACK_KEY_PREFIX =
		'email-update-callback';
	private readonly CALLBACK_TTL = 1800;
	private readonly CODE_TTL = 600;

	public constructor(
		private readonly prismaService: PrismaService,
		@Inject(REDIS_CLIENT) private readonly redis: RedisClientType,
		private readonly mailService: MailService
	) {}

	public async confirmEmailChange(
		userId: string,
		dto: UpdateUserEmailTokenDto
	) {
		const currentUser = await this.prismaService.user.findUnique({
			where: { id: userId },
			select: { id: true, email: true }
		});

		if (!currentUser) {
			throw new NotFoundException('Пользователь не найден');
		}

		await this.assertCallbackOwnership(dto.tokenCallback, userId);

		const rawToken = await this.redis.get(
			`${this.REDIS_EMAIL_UPDATE_KEY_PREFIX}:${userId}`
		);
		if (!rawToken) throw new NotFoundException('Код не найден');

		const { newEmail, code: token } = JSON.parse(rawToken);

		if (token !== dto.token) {
			throw new BadRequestException('Неверный код');
		}

		const emailTaken = await this.prismaService.user.findUnique({
			where: { email: newEmail }
		});

		if (emailTaken) {
			await this.redis.del(
				`${this.REDIS_EMAIL_UPDATE_KEY_PREFIX}:${userId}`
			);
			throw new ConflictException(
				'Почта была занята пока вы подтверждали'
			);
		}

		await this.prismaService.user.update({
			where: { id: userId },
			data: { email: newEmail, isActivated: true }
		});

		await this.redis.del(`${this.REDIS_EMAIL_UPDATE_KEY_PREFIX}:${userId}`);

		await this.redis.del(
			`${this.REDIS_EMAIL_UPDATE_CALLBACK_KEY_PREFIX}:${dto.tokenCallback}`
		);

		await this.mailService.sendChangeEmailNotification(
			currentUser.email,
			newEmail
		);
	}

	public async requestChangeEmailToken(
		userId: string,
		dto: UpdateUserEmailDto
	) {
		const existingUser = await this.prismaService.user.findUnique({
			where: { id: userId }
		});

		if (!existingUser) {
			throw new NotFoundException('Пользователя не существует');
		}

		await this.assertCallbackOwnership(dto.tokenCallback, userId);

		if (existingUser.email === dto.email) {
			throw new BadRequestException('Новая почта совпадает с текущей');
		}

		const emailTaken = await this.prismaService.user.findUnique({
			where: { email: dto.email }
		});

		if (emailTaken) {
			throw new ConflictException('Почта занята');
		}

		const code = randomInt(100000, 999999).toString();

		await this.redis.set(
			`${this.REDIS_EMAIL_UPDATE_KEY_PREFIX}:${userId}`,
			JSON.stringify({ newEmail: dto.email, code }),
			{ EX: this.CODE_TTL }
		);

		await this.mailService.sendUpdateEmailToken(dto.email, code);

		return true;
	}

	public async sendChangeEmailCallback(userId: string) {
		const existingUser = await this.prismaService.user.findUnique({
			where: { id: userId },
			select: { id: true, email: true }
		});

		if (!existingUser) {
			throw new NotFoundException('Пользователя не существует');
		}

		const token = v4();

		await this.redis.set(
			`${this.REDIS_EMAIL_UPDATE_CALLBACK_KEY_PREFIX}:${token}`,
			JSON.stringify({ userId, email: existingUser.email }),
			{ EX: this.CALLBACK_TTL }
		);

		await this.mailService.sendUpdateEmailCallback(
			existingUser.email,
			token
		);

		return true;
	}

	private async assertCallbackOwnership(
		tokenCallback: string,
		userId: string
	): Promise<void> {
		const raw = await this.redis.get(
			`${this.REDIS_EMAIL_UPDATE_CALLBACK_KEY_PREFIX}:${tokenCallback}`
		);
		if (!raw) {
			throw new NotFoundException('Ссылка недействительна или истекла');
		}
		const { userId: tokenUserId } = JSON.parse(raw);
		if (tokenUserId !== userId) {
			throw new ForbiddenException(
				'Нет прав на изменение почты другого пользователя'
			);
		}
	}
}
