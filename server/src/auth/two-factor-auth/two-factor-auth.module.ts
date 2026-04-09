import { MailModule } from '@/libs/mail/mail.module';
import { MailService } from '@/libs/mail/mail.service';
import { TokenService } from '@/token-service/token-service.service';
import { Module } from '@nestjs/common';

import { TwoFactorAuthService } from './two-factor-auth.service';

@Module({
	providers: [TwoFactorAuthService, MailService, TokenService],
	exports: [TwoFactorAuthService]
})
export class TwoFactorAuthModule {}
