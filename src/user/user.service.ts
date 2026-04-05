import * as argon2 from 'argon2';
import { AuthMethod, User } from 'generated/prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

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
			throw new NotFoundException('User with this id doesnt exist');
		}
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
}
