import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { RequestPasswordResetDto } from './dto/requestPasswordReset.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { PasswordResetService } from './password-reset.service';

@Controller('password-reset')
export class PasswordResetController {
	constructor(private readonly passwordResetService: PasswordResetService) {}

	@Post('request')
	@HttpCode(HttpStatus.OK)
	async requestEmail(@Body() dto: RequestPasswordResetDto) {
		await this.passwordResetService.requestEmail(dto.email);
		return { message: 'Письмо для смены пароля отправлено' };
	}

	@Post('reset')
	@HttpCode(HttpStatus.OK)
	async resetPassword(@Body() dto: ResetPasswordDto) {
		await this.passwordResetService.resetPassword(dto.token, dto.password);
		return { message: 'Пароль обновлен' };
	}
} 
