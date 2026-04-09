import { type Request } from 'express';

import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req
} from '@nestjs/common';

import { ConfirmationDto } from './dto/confirmation.dto';
import { MailConfirmationService } from './mail-confirmation.service';

@Controller('auth/mail-confirmation')
export class MailConfirmationController {
	constructor(
		private readonly mailConfirmationService: MailConfirmationService
	) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	public async newVerification(
		@Req() req: Request,
		@Body() dto: ConfirmationDto
	) {
		return this.mailConfirmationService.newVerificationToken(req, dto);
	}
}
