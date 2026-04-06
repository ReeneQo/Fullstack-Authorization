import { Request } from 'express';
import { User } from 'generated/prisma/client';
import { TokenType } from 'generated/prisma/enums';
import { v4 } from 'uuid';

import { AuthService } from '@/auth/auth.service';
import { MailService } from '@/libs/mail/mail.service';
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
		private readonly authService: AuthService
	) {}

	public async newVerificationToken(req: Request, dto: ConfirmationDto) {
		const existingToken = await this.prismaService.token.findFirst({
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

	public async sendVerificationToken(user: User) {
		const verificationToken = this.generateVerificationToken(user.email);

		await this.mailService.sendConfirmationEmail(
			(await verificationToken).email,
			(await verificationToken).token
		);

		return true;
	}

	private async generateVerificationToken(email: string) {
		const token = v4();
		const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email: email,
				type: TokenType.VERIFICATION
			}
		});

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.VERIFICATION
				}
			});
		}

		const verificationToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.VERIFICATION
			}
		});

		return verificationToken;
	}
}
