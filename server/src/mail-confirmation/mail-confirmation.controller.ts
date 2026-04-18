import { type Request } from 'express';

import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { ConfirmationDto } from './dto/confirmation.dto';
import { MailConfirmationService } from './mail-confirmation.service';

@Controller('mail/confirmation')
export class MailConfirmationController {
	constructor(
		private readonly mailConfirmationService: MailConfirmationService
	) {}

	@Throttle({ default: { limit: 10, ttl: 1_800_000 } })
	@Post('verification')
	@HttpCode(HttpStatus.OK)
	public async newVerification(
		@Req() req: Request,
		@Body() dto: ConfirmationDto
	) {
		return this.mailConfirmationService.newVerificationToken(req, dto);
	}
}
