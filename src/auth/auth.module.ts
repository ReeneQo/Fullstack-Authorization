import { providerConfig } from '@/config/provider.config';
import { getRecaptchaConfig } from '@/config/recaptcha.config';
import { MailConfirmationModule } from '@/mail-confirmation/mail-confirmation.module';
import { ProviderModule } from '@/provider/provider.module';
import { UserService } from '@/user/user.service';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	imports: [
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getRecaptchaConfig,
			inject: [ConfigService]
		}),
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			useFactory: providerConfig,
			inject: [ConfigService]
		}),
		forwardRef(() => MailConfirmationModule)
	],
	controllers: [AuthController],
	providers: [AuthService, UserService],
	exports: [AuthService]
})
export class AuthModule {}
