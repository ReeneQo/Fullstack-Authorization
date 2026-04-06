import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserMiddleware } from './libs/middleware/userLogger.middlewate';
import { PrismaModule } from './prisma/prisma.module';
import { ProviderModule } from './provider/provider.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';
import { TelegramModule } from './telegram/telegram.module';
import { MailModule } from './libs/mail/mail.module'
import { MailConfirmationModule } from './mail-confirmation/mail-confirmation.module';

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
		MailConfirmationModule
	]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(UserMiddleware).forRoutes('users');
	}
}
