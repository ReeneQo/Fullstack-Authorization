import { Request } from 'express';
import { User } from 'generated/prisma/client';
import { TokenType } from 'generated/prisma/enums';
import { v4 } from 'uuid';

import { AuthService } from '@/auth/auth.service';
import { MailService } from '@/libs/mail/mail.service';
import { TokenService } from '@/token-service/token-service.service';
import { UserService } from '@/user/user.service';
import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common';

import { PrismaService } from './../prisma/prisma.service';
import { ConfirmationDto } from './dto/confirmation.dto';

@Injectable()
export class MailConfirmationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly userService: UserService,
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,
		private readonly tokenService: TokenService
	) {}

	public async newVerificationToken(req: Request, dto: ConfirmationDto) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token: dto.token,
				type: TokenType.VERIFICATION
			}
		});

		if (!existingToken) {
			throw new NotFoundException('Токен не найден, попробуйте еще раз');
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date();

		if (hasExpired) {
			throw new BadRequestException(
				'Токен подтверждения истек, пожалуйста запросите новый'
			);
		}

		const existingUser = await this.userService.findByEmail(
			existingToken.email
		);

		if (!existingUser) {
			throw new NotFoundException(
				'Пользователь с указанной почтой не найден'
			);
		}

		await this.prismaService.user.update({
			where: {
				id: existingUser.id
			},
			data: {
				isActivated: true
			}
		});

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.VERIFICATION
			}
		});

		return this.authService.saveSession(req, existingUser);
	}

	public async sendVerificationToken(email: string) {
		const verificationToken = await this.tokenService.generate(
			email,
			TokenType.VERIFICATION,
			3600 * 1000
		);

		await this.mailService.sendConfirmationEmail(
			verificationToken.email,
			verificationToken.token
		);

		return true;
	}
}
