import type { Request, Response } from 'express';
import { UserRole } from 'generated/prisma/enums';

import { Authorization } from '@/auth/decorators/auth.decorator';
import { Authorized } from '@/auth/decorators/authorized.decorator';
import { MailConfirmationService } from '@/mail-confirmation/mail-confirmation.service';
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Req,
	Res
} from '@nestjs/common';

import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly mailConfirmationService: MailConfirmationService
	) {}

	@Authorization(UserRole.REGULAR)
	@HttpCode(HttpStatus.OK)
	@Get('profile')
	async getUser(@Authorized('id') userId: string) {
		return this.userService.findById(userId);
	}

	@Authorization(UserRole.REGULAR)
	@HttpCode(HttpStatus.OK)
	@Get('by-id/:id')
	async getUserById(@Param('id') id: string) {
		return this.userService.findById(id);
	}

	@Authorization(UserRole.REGULAR)
	@HttpCode(HttpStatus.OK)
	@Patch('update/profile')
	async updateProfile(
		@Authorized('id') userId: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfileData(userId, dto);
	}

	@Authorization(UserRole.REGULAR)
	@HttpCode(HttpStatus.OK)
	@Patch('update/email')
	async updateEmail(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Authorized('id') userId: string,
		@Body() dto: UpdateUserEmailDto
	) {
		await this.userService.updateEmail(req, res, userId, dto);
		await this.mailConfirmationService.sendVerificationToken(dto.email);
		return { message: 'Проверьте указанный почтовый адрес' };
	}

	@Authorization(UserRole.REGULAR)
	@HttpCode(HttpStatus.OK)
	@Patch('update/password')
	async updatePassword(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Authorized('id') userId: string,
		@Body() dto: UpdateUserPasswordDto
	) {
		return this.userService.updatePassword(req, res, userId, dto);
	}
}
