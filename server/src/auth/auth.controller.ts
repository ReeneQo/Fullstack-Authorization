import type { Request, Response } from 'express';

import { ProviderService } from '@/provider/provider.service';
import { SessionsService } from '@/sessions/sessions.service';
import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	Delete,
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
import { Authorization } from './decorators/auth.decorator';
import { Authorized } from './decorators/authorized.decorator';
import { AddPasswordOauthDto } from './dto/addPasswordOauth.dto';
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
	@Get('/oauth/connect/:provider')
	public async connect(@Param('provider') provider: string) {
		const providerInstance =
			this.providerService.findServiceByName(provider);

		return {
			url: providerInstance?.getAuthUrl()
		};
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
		const origin = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');

		if (!code) {
			throw new BadRequestException(
				'Код авторизации не был предоставлен'
			);
		}

		try {
			const user = await this.authService.extractProfile(provider, code);
			await this.sessionService.saveSession(req, user);
			return res.redirect(`${origin}/dashboard/settings`);
		} catch (error) {
			if (error instanceof ConflictException) {
				return res.redirect(`${origin}/auth/login?error=emailExist`);
			}
			if (error) {
				return res.redirect(`${origin}/auth/login?error=serverError`);
			}
		}
	}

	@Throttle({ default: { limit: 10, ttl: 60_000 } })
	@UseGuards(providerGuard)
	@Authorization()
	@Get('/oauth/link/connect/:provider')
	public async connectLink(@Param('provider') provider: string) {
		const providerInstance =
			this.providerService.findServiceByName(provider);

		return {
			url: providerInstance?.getAuthUrl(true)
		};
	}

	@Throttle({ default: { limit: 10, ttl: 60_000 } })
	@UseGuards(providerGuard)
	@Authorization()
	@Get('/oauth/link/callback/:provider')
	public async link(
		@Res() res: Response,
		@Query('code') code: string,
		@Param('provider') provider: string,
		@Authorized('id') userId: string
	) {
		const origin = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');

		if (!code) {
			return res.redirect(`${origin}/dashboard/settings?error=no_code`);
		}

		try {
			await this.authService.extractLinkProfile(provider, code, userId);
			return res.redirect(
				`${origin}/dashboard/oauth/services?code=success`
			);
		} catch (error) {
			if (error instanceof ConflictException) {
				return res.redirect(
					`${origin}/dashboard/oauth/services?code=already_linked`
				);
			}
			return res.redirect(
				`${origin}/dashboard/oauth/services?code=link_failed`
			);
		}
	}

	@Throttle({ default: { limit: 10, ttl: 60_000 } })
	@UseGuards(providerGuard)
	@Authorization()
	@Delete('/oauth/link/unlink/:provider')
	public async unlink(
		@Param('provider') provider: string,
		@Authorized('id') userId: string
	) {
		return this.authService.unlinkProfile(provider, userId);
	}

	@Throttle({ default: { limit: 3, ttl: 60_000 } })
	@Authorization()
	@Post('/oauth/add/password')
	@HttpCode(HttpStatus.NO_CONTENT)
	public async addPasswordOauth(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Authorized('id') userId: string,
		@Body() dto: AddPasswordOauthDto
	) {
		await this.authService.addPasswordOauth(userId, dto);
		await this.sessionService.destroySession(req, res);
	}
}
