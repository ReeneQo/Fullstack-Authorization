import type { Request, Response } from 'express';

import { Authorization } from '@/auth/decorators/auth.decorator';
import { Authorized } from '@/auth/decorators/authorized.decorator';
import { EmailUpdateService } from '@/email-update/email-update.service';
import { MailConfirmationService } from '@/mail-confirmation/mail-confirmation.service';
import { SessionsService } from '@/sessions/sessions.service';
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Req,
	Res
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { UserRole } from '../../generated/prisma/enums';

import { UpdateUserEmailTokenDto } from './dto/update-user-email-token.dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly mailUpdateService: EmailUpdateService,
		private readonly sessionService: SessionsService
	) {}

	@Authorization(UserRole.REGULAR)
	@HttpCode(HttpStatus.OK)
	@Get('profile')
	async getUser(@Authorized('id') userId: string) {
		return this.userService.findById(userId);
	}

	@Throttle({ default: { limit: 5, ttl: 120_000 } })
	@Authorization(UserRole.REGULAR)
	@HttpCode(HttpStatus.OK)
	@Patch('update/profile')
	async updateProfile(
		@Authorized('id') userId: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfileData(userId, dto);
	}

	@Throttle({ default: { limit: 10, ttl: 1_800_000 } })
	@Authorization(UserRole.REGULAR)
	@HttpCode(HttpStatus.OK)
	@Post('update/email/request')
	async updateEmailRequest(
		@Authorized('id') userId: string,
		@Body() dto: UpdateUserEmailDto
	) {
		await this.mailUpdateService.sendUpdateEmailToken(userId, dto.email);
	}

	@Throttle({ default: { limit: 10, ttl: 1_800_000 } })
	@Authorization(UserRole.REGULAR)
	@HttpCode(HttpStatus.OK)
	@Patch('update/email/confirm-update')
	async updateEmailValidateToken(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Authorized('id') userId: string,
		@Body() dto: UpdateUserEmailTokenDto
	) {
		await this.mailUpdateService.confirmEmailChange(userId, dto.token);

		await this.sessionService.destroySession(req, res);

		return { success: 'Успешная смена почты!' };
	}

	@Throttle({ default: { limit: 10, ttl: 1_800_000 } })
	@Authorization(UserRole.REGULAR)
	@HttpCode(HttpStatus.OK)
	@Patch('update/password')
	async updatePassword(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Authorized('id') userId: string,
		@Body() dto: UpdateUserPasswordDto
	) {
		await this.userService.updatePassword(userId, dto);

		await this.sessionService.destroySession(req, res);

		return { success: 'Успешная смена пароля' };
	}
}
