import { TokenType } from 'generated/prisma/enums';
import { v4 } from 'uuid';

import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async generate(
		email: string,
		type: TokenType,
		expiresInMs: number,
		customToken?: string
	) {
		const token = customToken ?? v4();
		const expiresIn = new Date(new Date().getTime() + expiresInMs);

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email: email,
				type: type
			}
		});

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id,
					type: type
				}
			});
		}

		return this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: type
			}
		});
	}
}
