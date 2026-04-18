import type { Request, Response } from 'express';

import { ProviderService } from '@/provider/provider.service';
import { SessionsService } from '@/sessions/sessions.service';
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Query,
	Req,
	Res,
	UseGuards
} from '@nestjs/common';
import { Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { providerGuard } from './guards/provider.guard';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly providerService: ProviderService,
		private readonly configService: ConfigService,
		private readonly sessionService: SessionsService
	) {}

	@Throttle({ default: { limit: 10, ttl: 1_800_000 } })
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	register(@Body() dto: RegisterDto) {
		return this.authService.register(dto);
	}

	@Throttle({ default: { limit: 10, ttl: 60_000 } })
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Req() req: Request, @Body() dto: LoginDto) {
		const result = await this.authService.login(dto);

		if (result.status === '2fa_required') {
			return {
				message:
					'Проверьте вашу почту. Требуется код двухфакторной аутентификации.'
			};
		}

		return this.sessionService.saveSession(req, result.user);
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.sessionService.destroySession(req, res);
	}

	@Throttle({ default: { limit: 10, ttl: 60_000 } })
	@UseGuards(providerGuard)
	@Get('/oauth/callback/:provider')
	public async callback(
		@Req() req: Request,
		@Res() res: Response,
		@Query('code') code: string,
		@Param('provider') provider: string
	) {
		if (!code) {
			throw new BadRequestException(
				'Код авторизации не был предоставлен'
			);
		}

		const user = await this.authService.extractProfile(provider, code);
		await this.sessionService.saveSession(req, user);
		return res.redirect(
			`${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard/settings`
		);
	}

	@Throttle({ default: { limit: 10, ttl: 60_000 } })
	@UseGuards(providerGuard)
	@Get('/oauth/connect/:provider')
	public async connect(@Param('provider') provider: string) {
		const providerInstance =
			this.providerService.findServiceByName(provider);

		return {
			url: providerInstance?.getAuthUrl()
		};
	}
}
