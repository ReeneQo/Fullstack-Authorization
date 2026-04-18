import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { TwoFactorAuthModule } from './auth/two-factor-auth/two-factor-auth.module';
import { EmailUpdateModule } from './email-update/email-update.module';
import { MailModule } from './libs/mail/mail.module';
import { UserMiddleware } from './libs/middleware/userLogger.middlewate';
import { MailConfirmationModule } from './mail-confirmation/mail-confirmation.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProviderModule } from './provider/provider.module';
import { RedisModule } from './redis/redis.module';
import { SessionsModule } from './sessions/sessions.module';
import { TelegramModule } from './telegram/telegram.module';
import { TokenServiceModule } from './token-service/token-service.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		PrismaModule,
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
		EmailUpdateModule
	]
})
export class AppModule {}
