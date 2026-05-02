import * as argon2 from 'argon2';

import { MailConfirmationService } from '@/mail-confirmation/mail-confirmation.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ProviderService } from '@/provider/provider.service';
import { UserService } from '@/user/user.service';
import {
	BadGatewayException,
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common';

import { Prisma, User } from '../../generated/prisma/client';

import { AddPasswordOauthDto } from './dto/addPasswordOauth.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@Injectable()
export class AuthService {
	private readonly DUMMY_HASH =
		'$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHRkdW1teTEyMzQ1Ng$k8L3qV2pXz7mN9fR4tYhB6wEjK1sD0aC8uH5xP2vM7o';
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly providerService: ProviderService,
		private readonly emailConfirmationService: MailConfirmationService,
		private readonly twoFactorService: TwoFactorAuthService
	) {}
	async register(dto: RegisterDto) {
		const isExists = await this.userService.findByEmail(dto.email);

		if (isExists) {
			throw new ConflictException(
				'Регистрация не удалась. Пользователь с таким email уже существует. Пожалуйста, используйте другой email или войдите в систему'
			);
		}

		const newUser = await this.userService.createUser(
			dto.email,
			dto.password,
			dto.name,
			'',
			false
		);

		await this.emailConfirmationService.sendVerificationToken(
			newUser.email
		);

		return newUser;
	}

	async login(
		dto: LoginDto
	): Promise<{ status: 'success'; user: User } | { status: '2fa_required' }> {
		const user = await this.userService.findByEmail(dto.email);

		const hashToVerify = user?.password || this.DUMMY_HASH;
		const isValidPassword = await argon2.verify(hashToVerify, dto.password);

		if (!user || !user.password || !isValidPassword) {
			throw new UnauthorizedException(
				'Неверный пароль или такого пользователя не существует'
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

				return { status: '2fa_required' };
			}

			await this.twoFactorService.validateTwoFactorToken(
				user.email,
				dto.code
			);
		}

		return { status: 'success', user: user };
	}

	public async extractProfile(provider: string, code: string) {
		const providerInstance =
			this.providerService.findServiceByName(provider);

		if (!providerInstance) {
			throw new BadRequestException(
				`Провайдер ${providerInstance} не поддерживается`
			);
		}

		const profile = await providerInstance.findUserByCode(code);

		if (!profile) {
			throw new BadGatewayException('Профиль пользователя не найден');
		}

		const existingAccount = await this.prismaService.account.findFirst({
			where: {
				providerId: String(profile.id),
				provider: profile.provider
			}
		});

		if (existingAccount) {
			const user = await this.userService.findById(
				existingAccount.userId
			);
			if (!user) {
				throw new InternalServerErrorException(
					'Пользователь не найден'
				);
			}

			return user;
		}

		const user = await this.userService.createUser(
			profile.email,
			null,
			profile.name,
			profile.picture,
			true
		);

		await this.prismaService.account.create({
			data: {
				userId: user.id,
				type: profile.provider.toUpperCase(),
				provider: profile.provider,
				providerId: String(profile.id),
				accessToken: profile.access_token,
				refreshToken: profile.refresh_token,
				expiresAt: String(profile.expires_at)
			}
		});

		return user;
	}

	public async addPasswordOauth(userId: string, dto: AddPasswordOauthDto) {
		const hash = await argon2.hash(dto.password);

		try {
			await this.prismaService.user.update({
				where: { id: userId, password: null },
				data: {
					password: hash
				}
			});
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				throw new BadRequestException('Пароль уже установлен');
			}
			throw error;
		}
	}
}
