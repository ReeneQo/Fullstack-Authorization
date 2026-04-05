import { type Request } from 'express';

import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req
} from '@nestjs/common';

import { TelegramUserDto } from './dto/telegramUser.dto';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
	constructor(private readonly telegramService: TelegramService) {}

	@Post('oauth/verify')
	@HttpCode(HttpStatus.OK)
	verifyUserHash(@Body() dto: TelegramUserDto, @Req() req: Request) {
		return this.telegramService.verifyHash(dto, req);
	}
}
