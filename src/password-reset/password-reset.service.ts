import * as argon2 from 'argon2';
import { TokenType } from 'generated/prisma/enums';

import { MailService } from '@/libs/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import { TokenService } from '@/token-service/token-service.service';
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common';

@Injectable()
export class PasswordResetService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly tokenService: TokenService,
		private readonly mailService: MailService,
	) {}

	public async requestEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				email: email
			}
		});

		if (!user) {
			return true;
		}

		const resetPasswordToken = await this.tokenService.generate(
			email,
			TokenType.PASSWORD_RESET,
			15 * 60 * 1000
		);

		await this.mailService.sendResetPasswordEmail(
			email,
			resetPasswordToken.token
		);

		return true;
	}

	public async resetPassword(token: string, newPassword: string) {
		const existingToken = await this.prismaService.token.findFirst({
			where: {
				token: token,
				type: TokenType.PASSWORD_RESET
			}
		});

		if (!existingToken) {
			throw new NotFoundException('Токен сброса пароля не найден');
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date();

		if (hasExpired) {
			throw new BadRequestException(
				'Токен доступа для сброса пароля истек, попробуйте еще раз'
			);
		}

		const existingUser = await this.prismaService.user.findUnique({
			where: {
				email: existingToken.email
			}
		});

		if (!existingUser) {
			throw new NotFoundException(
				'Пользователь с такой почтой не найден'
			);
		}

		await this.prismaService.user.update({
			where: {
				email: existingUser.email
			},
			data: {
				password: await argon2.hash(newPassword)
			}
		});

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.PASSWORD_RESET
			}
		});
	}
}
