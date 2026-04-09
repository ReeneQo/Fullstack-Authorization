import * as argon2 from 'argon2';
import { Request, Response } from 'express';
import { AuthMethod, User } from 'generated/prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { SessionsService } from '@/sessions/sessions.service';
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly sessionsService: SessionsService
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

		return user;
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
		password: string,
		displayName: string,
		picture: string,
		isActivated: boolean,
		method: AuthMethod
	) {
		const user = await this.prismaService.user.create({
			data: {
				email,
				password: password ? await argon2.hash(password) : '',
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

	public async updateEmail(
		req: Request,
		res: Response,
		userId: string,
		dto: UpdateUserEmailDto
	) {
		await this.prismaService.user.update({
			where: { id: userId },
			data: {
				email: dto.email,
				isActivated: false
			}
		});

		await this.sessionsService.destroySession(req, res);
	}

	public async updatePassword(
		req: Request,
		res: Response,
		userId: string,
		dto: UpdateUserPasswordDto
	) {
		const user = await this.findById(userId);

		if (!user) {
			throw new NotFoundException('Пользователь не найден');
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

		await this.sessionsService.destroySession(req, res);
	}
}
