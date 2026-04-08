/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as argon2 from 'argon2';
import { type Request, Response } from 'express';
import { type User } from 'generated/prisma/client';
import { AuthMethod } from 'generated/prisma/enums';

import { MailConfirmationService } from '@/mail-confirmation/mail-confirmation.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ProviderService } from '@/provider/provider.service';
import { UserService } from '@/user/user.service';
import { forwardRef, Inject } from '@nestjs/common';
import {
	BadGatewayException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@Injectable()
export class AuthService {
	constructor(
		public readonly prismaService: PrismaService,
		public readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly providerService: ProviderService,
		@Inject(forwardRef(() => MailConfirmationService))
		private readonly emailConfirmationService: MailConfirmationService,
		private readonly twoFactorService: TwoFactorAuthService
	) {}
	// метод регистрации пользователя
	async register(req: Request, dto: RegisterDto) {
		// ищем пользователя в бд
		const isExists = await this.userService.findByEmail(dto.email);

		// Здесь проверяем существует ли такой, и если да, то кидаем 409 ошибку
		if (isExists) {
			throw new ConflictException(
				'Регистрация не удалась. Пользователь с таким email уже существует. Пожалуйста, используйте другой email или войдите в систему'
			);
		}

		// Здесь создаем нового пользователя, где берем поля емейл имя и пароль из дтошки, картинка пустая, активирован - нет, метод - регистрация обычная данные с енама
		const newUser = await this.userService.createUser(
			dto.email,
			dto.password,
			dto.name,
			'',
			false,
			AuthMethod.CREDENTIALS
		);

		await this.emailConfirmationService.sendVerificationToken(
			newUser.email
		);
		// и просто возвращаем нового юзера
		return this.saveSession(req, newUser);
	}

	async login(req: Request, dto: LoginDto) {
		const user = await this.userService.findByEmail(dto.email);

		if (!user || !user.password) {
			throw new NotFoundException(
				'This users wasnt found, please try again'
			);
		}

		const isValidPassword = await argon2.verify(
			user.password,
			dto.password
		);

		if (!isValidPassword) {
			throw new UnauthorizedException(
				'Incorrect password, pls try again or reset password'
			);
		}

		if (!user.isActivated) {
			await this.emailConfirmationService.sendVerificationToken(
				user.email
			);
			throw new UnauthorizedException(
				'Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите адрес'
			);
		}

		if (user.isTwoFactorEnabled) {
			if (!dto.code) {
				await this.twoFactorService.sendTwoFactorToken(user.email);

				return {
					message:
						'Проверьте вашу почту. Требуется код двухфакторной аутентификации.'
				};
			}

			await this.twoFactorService.validateTwoFactorToken(
				user.email,
				dto.code
			);
		}

		return this.saveSession(req, user);
	}

	public async extractProfile(req: Request, provider: string, code: string) {
		const providerInstance =
			this.providerService.findServiceByName(provider);
		const profile = await providerInstance?.findUserByCode(code);

		if (!profile) {
			throw new BadGatewayException('DSDS');
		}

		const account = await this.prismaService.account.findFirst({
			where: {
				id: profile.id,
				provider: profile.provider
			}
		});

		let user = account?.userId
			? await this.userService.findById(account.userId)
			: null;

		if (user) {
			return this.saveSession(req, user);
		}

		user = await this.userService.createUser(
			profile.email,
			'',
			profile.name,
			profile.picture,
			true,
			AuthMethod[profile.provider.toLocaleUpperCase()]
		);

		if (!account) {
			await this.prismaService.account.create({
				data: {
					userId: user.id,
					type: 'oauth',
					provider: profile.provider,
					accessToken: profile.access_token,
					refreshToken: profile.refresh_token,
					expiresAt: `${profile.expires_at}`
				}
			});
		}

		return this.saveSession(req, user);
	}

	async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					reject(
						new InternalServerErrorException(
							'An error occured during the end of session. There may be an error with the server or the session has already been terminated'
						)
					);

					res.clearCookie(
						this.configService.getOrThrow('SESSION_NAME')
					);
					resolve();
				}
			});
		});
	}

	//	функиця сохранения сессий где мы каждую сессию связавыем айдишником с юзером, и затем она сохраняется в redis, если нету ошибок
	public saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.regenerate(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Error while regenerating session token'
						)
					);
				}
				req.session.userId = user.id;

				req.session.save(err => {
					if (err) {
						return reject(
							new InternalServerErrorException(
								'Error when saving a session, you can check the session parameters'
							)
						);
					}

					resolve({ user });
				});
			});
		});
	}
}
