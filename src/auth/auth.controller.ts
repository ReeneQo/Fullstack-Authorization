/* eslint-disable @typescript-eslint/require-await */
import type { Request, Response } from 'express';

import { userAgent } from '@/libs/decorator/user-agent.decorator';
import { UnauthorizedExceptionFilter } from '@/libs/filter/http-exception.filter';
import { ParseIdIntoNumber } from '@/libs/pipes/parseIdIntoNumber.pipe';
import { toLowerCasePipe } from '@/libs/pipes/toLowerCase.pipe';
import { ProviderService } from '@/provider/provider.service';
import { TelegramUserDto } from '@/telegram/dto/telegramUser.dto';
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Query,
	Redirect,
	Req,
	Res,
	UseFilters,
	UseGuards,
	UsePipes
} from '@nestjs/common';
import { Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { providerGuard } from './guards/provider.guard';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly providerService: ProviderService,
		private readonly configService: ConfigService
	) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	register(@Req() req: Request, @Body() dto: RegisterDto) {
		return this.authService.register(req, dto);
	}

	@Post('login')
	// @UseFilters(new UnauthorizedExceptionFilter())
	@HttpCode(HttpStatus.CREATED)
	login(@Req() req: Request, @Body() dto: LoginDto) {
		return this.authService.login(req, dto);
	}

	@Post('logout')
	@HttpCode(HttpStatus.CREATED)
	logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.logout(req, res);
	}

	@UsePipes(toLowerCasePipe)
	@Post('movie')
	@HttpCode(HttpStatus.OK)
	create(@Body('id', new ParseIdIntoNumber()) id: number) {
		return `Title: ${typeof id}`;
	}

	@Get('me')
	getProfile(@userAgent() user: string) {
		return {
			user
		};
	}

	@UseGuards(providerGuard)
	@Get('/oauth/callback/:provider')
	public async callback(
		@Req() req: Request,
		@Res() res: Response,
		@Query('code') code: string,
		@Param('provider') provider: string
	) {
		if (!code) {
			throw new BadRequestException('the auth code wasnt provided');
		}

		await this.authService.extractProfile(req, provider, code);

		return res.redirect(
			`${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}`
		);
	}

	@UseGuards(providerGuard)
	@Get('/oauth/connect/:provider')
	public async connect(@Param('provider') provider: string) {
		const providerInstance =
			this.providerService.findServiceByName(provider);

		return {
			url: providerInstance?.getAuthUrl()
		};
	}

	@Get('oauth/telegram')
	public telegramCallback(@Req() req: Request, @Res() res: Response) {
		console.log('🔍 Полный URL:', req.originalUrl);
		res.redirect('http://26.133.227.23:3000');
	}

	@HttpCode(HttpStatus.OK)
	@Post('oauth/telegram/verify')
	public telegramVerifyData(@Body() body: TelegramUserDto) {
		console.log(body);
		return body;
	}
}
