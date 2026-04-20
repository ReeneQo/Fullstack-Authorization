import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { TwoFactorAuthModule } from './auth/two-factor-auth/two-factor-auth.module';
import storageConfig from './config/storage.config';
import { EmailUpdateModule } from './email-update/email-update.module';
import { MailModule } from './libs/mail/mail.module';
import { MailConfirmationModule } from './mail-confirmation/mail-confirmation.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProviderModule } from './provider/provider.module';
import { RedisModule } from './redis/redis.module';
import { SessionsModule } from './sessions/sessions.module';
import { StorageModule } from './storage/storage.module';
import { TelegramModule } from './telegram/telegram.module';
import { TokenServiceModule } from './token-service/token-service.module';
import { AvatarModule } from './user/avatar/avatar.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [storageConfig],
			isGlobal: true,
			envFilePath: '.env'
		}),
		RedisModule,
		PrismaModule,
		AuthModule,
		UserModule,
		ProviderModule,
		TelegramModule,
		MailModule,
		MailConfirmationModule,
		PasswordResetModule,
		TokenServiceModule,
		TwoFactorAuthModule,
		SessionsModule,
		EmailUpdateModule,
		ThrottlerModule.forRoot([
			{
				ttl: 30_000,
				limit: 10
			}
		]),
		StorageModule,
		AvatarModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {}
