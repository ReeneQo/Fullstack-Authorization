import { randomInt } from 'crypto';
import { type RedisClientType } from 'redis';

import { MailService } from '@/libs/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import { REDIS_CLIENT } from '@/redis/redis.module';
import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common';

@Injectable()
export class EmailUpdateService {
	private readonly TTL = 600;
	private readonly REDIS_KEY_PREFIX = 'email-update';

	public constructor(
		private readonly prismaService: PrismaService,
		@Inject(REDIS_CLIENT) private readonly redis: RedisClientType,
		private readonly mailService: MailService
	) {}

	public async confirmEmailChange(userId: string, code: string) {
		const raw = await this.redis.get(`${this.REDIS_KEY_PREFIX}:${userId}`);
		if (!raw) throw new NotFoundException('Код не найден');

		const { newEmail, code: token } = JSON.parse(raw);

		if (token !== code) {
			throw new BadRequestException('Неверный код');
		}

		const emailTaken = await this.prismaService.user.findUnique({
			where: { email: newEmail }
		});
		if (emailTaken) {
			await this.redis.del(`${this.REDIS_KEY_PREFIX}:${userId}`);
			throw new BadRequestException(
				'Почта была занята пока вы подтверждали'
			);
		}

		await this.prismaService.user.update({
			where: { id: userId },
			data: { email: newEmail, isActivated: true }
		});

		await this.redis.del(`${this.REDIS_KEY_PREFIX}:${userId}`);

		return true;
	}

	public async sendUpdateEmailToken(userId: string, email: string) {
		const existingUser = await this.prismaService.user.findUnique({
			where: { id: userId }
		});

		if (!existingUser) {
			throw new NotFoundException('Пользователя не существует');
		}

		if (existingUser.email === email) {
			throw new BadRequestException('Новая почта совпадает с текущей');
		}

		const emailTaken = await this.prismaService.user.findUnique({
			where: { email }
		});

		if (emailTaken) {
			throw new BadRequestException('Почта занята');
		}

		const code = randomInt(100000, 1000000).toString();

		await this.redis.set(
			`${this.REDIS_KEY_PREFIX}:${userId}`,
			JSON.stringify({ newEmail: email, code }),
			{ EX: this.TTL }
		);

		await this.mailService.sendUpdateEmailToken(email, code);

		return true;
	}
}
