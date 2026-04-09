import * as crypto from 'crypto';
import { type Request } from 'express';
import { AuthMethod } from 'generated/prisma/enums';

import { SessionsService } from '@/sessions/sessions.service';
import { UserService } from '@/user/user.service';
import {
	ConflictException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TelegramUserDto } from './dto/telegramUser.dto';

@Injectable()
export class TelegramService {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
		private readonly sessionsService: SessionsService
	) {}

	async verifyHash(userDto: TelegramUserDto, req: Request) {
		let dataToCheck = this.prepareDataForHash(userDto);
		const botToken = this.configService.getOrThrow<string>(
			'TELEGRAM_BOT_SECRET'
		);
		const secretKey = crypto.createHash('sha256').update(botToken).digest();
		this.validateHash(dataToCheck, secretKey, userDto);
		console.log('success');
		return this.registerTelegram(req, userDto);
	}

	private prepareDataForHash(userDto: Record<string, any>) {
		if (!userDto) {
			throw new UnauthorizedException('NO USER DATA');
		}

		const { hash, ...data } = userDto;

		const sortedKeys = Object.keys(data).sort();

		const dataCheckString = sortedKeys
			.map(key => {
				const value = data[key];
				return `${key}=${value}`;
			})
			.join('\n');

		return dataCheckString;
	}

	private validateHash(
		dataToCheck: string,
		secret: Buffer,
		userDto: TelegramUserDto
	) {
		const _hash = crypto
			.createHmac('sha256', secret)
			.update(dataToCheck)
			.digest('hex');
		console.log(_hash);
		console.log(userDto.hash);
		console.log(dataToCheck);

		if (userDto.hash !== _hash) {
			throw new UnauthorizedException('bad hash bro!');
		}
	}

	private async registerTelegram(req: Request, dto: TelegramUserDto) {
		const isExists = await this.userService.findByEmail(dto.username);

		if (isExists) {
			throw new ConflictException(
				'Регистрация не удалась. Пользователь с таким email уже существует. Пожалуйста, используйте другой email или войдите в систему'
			);
		}
		const newUser = await this.userService.createUser(
			dto.username,
			'',
			dto.first_name,
			dto.photo_url ?? '',
			true,
			AuthMethod.TELEGRAM
		);
		return this.sessionsService.saveSession(req, newUser);
	}
}
