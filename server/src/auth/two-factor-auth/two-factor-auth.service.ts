import { randomInt } from 'crypto';

import { MailService } from '@/libs/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import { TokenService } from '@/token-service/token-service.service';
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common';

import { TokenType } from '../../../generated/prisma/enums';

const TWO_FACTOR_TOKEN_TTL = 3600 * 1000;
@Injectable()
export class TwoFactorAuthService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly tokenService: TokenService
	) {}

	public async validateTwoFactorToken(email: string, code: string) {
		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email: email,
				type: TokenType.TWO_FACTOR
			}
		});

		if (!existingToken) {
			throw new NotFoundException(
				'Токен двухфакторной аутентификации не найден. Убедитесь что вы запрашивали токен для данного адреса электронной почты.'
			);
		}

		if (existingToken.token !== code) {
			throw new BadRequestException(
				'Hеверный код двухфакторной аутентификации. Пожалуйста, проверьте введенный код и попробуйте снова.'
			);
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date();

		if (hasExpired) {
			throw new BadRequestException(
				'Срок действия токена двухфакторной аутентификации истек. Пожалуйста запросите новый токен.'
			);
		}

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.TWO_FACTOR
			}
		});

		return true;
	}

	public async sendTwoFactorToken(email: string) {
		const code = randomInt(100000, 999999).toString();
		const twoFactorToken = await this.tokenService.generate(
			email,
			TokenType.TWO_FACTOR,
			TWO_FACTOR_TOKEN_TTL,
			code
		);

		await this.mailService.sendTwoFactorAuthEmail(
			twoFactorToken.email,
			twoFactorToken.token
		);

		return true;
	}
}
