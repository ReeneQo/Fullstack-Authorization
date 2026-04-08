import { providerConfig } from '@/config/provider.config';
import { getRecaptchaConfig } from '@/config/recaptcha.config';
import { MailModule } from '@/libs/mail/mail.module';
import { MailService } from '@/libs/mail/mail.service';
import { MailConfirmationModule } from '@/mail-confirmation/mail-confirmation.module';
import { ProviderModule } from '@/provider/provider.module';
import { TokenServiceModule } from '@/token-service/token-service.module';
import { UserService } from '@/user/user.service';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

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
		forwardRef(() => MailConfirmationModule),
		MailModule,
		TokenServiceModule
	],
	controllers: [AuthController],
	providers: [AuthService, UserService, TwoFactorAuthService],
	exports: [AuthService]
})
export class AuthModule {}
