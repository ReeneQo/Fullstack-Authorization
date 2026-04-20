import * as argon2 from 'argon2';

import { PrismaService } from '@/prisma/prisma.service';
import { StorageService } from '@/storage/storage.service';
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common';

import { AuthMethod, User } from '../../generated/prisma/browser';

import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService
	) {}

	async findById(id: string): Promise<User | null> {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			},
			include: {
				account: true
			}
		});

		if (!user) {
			throw new NotFoundException('Пользователь не найден');
		}

		const avatarUrl = await this.resolveAvatarUrl(
			user?.picture,
			user?.avatarKey
		);

		return {
			...user,
			avatarKey: avatarUrl
		};
	}

	private async resolveAvatarUrl(
		picture: string | null,
		avatarKey: string | null
	): Promise<string | null> {
		if (avatarKey) {
			return this.storageService.getPresignedUrl(avatarKey);
		}

		if (picture) {
			return picture;
		}

		return null;
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.prismaService.user.findUnique({
			where: {
				email
			},
			include: {
				account: true
			}
		});

		return user;
	}

	async createUser(
		email: string,
		password: string | null,
		displayName: string,
		picture: string,
		isActivated: boolean,
		method: AuthMethod
	) {
		const user = await this.prismaService.user.create({
			data: {
				email,
				password: password ? await argon2.hash(password) : null,
				displayName,
				picture,
				isActivated,
				method
			},
			include: {
				account: true
			}
		});

		return user;
	}

	public async updateProfileData(userId: string, dto: UpdateUserDto) {
		const updatedUser = await this.prismaService.user.update({
			where: { id: userId },
			data: {
				displayName: dto.name,
				isTwoFactorEnabled: dto.isTwoFactorEnabled
			}
		});

		return updatedUser;
	}

	public async updatePassword(userId: string, dto: UpdateUserPasswordDto) {
		const user = await this.findById(userId);

		if (!user) {
			throw new NotFoundException('Пользователь не найден');
		}

		if (!user.password) {
			throw new BadRequestException(
				'У вас авторизация через сервисы, она не предусматривает наличие пароля'
			);
		}

		const verifyCurrentPassword = await argon2.verify(
			user.password,
			dto.currentPassword
		);

		if (!verifyCurrentPassword) {
			throw new BadRequestException('Введен неверный настоящий пароль');
		}

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				password: await argon2.hash(dto.password)
			}
		});
	}
}
