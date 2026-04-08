import { MailModule } from '@/libs/mail/mail.module';
import { TokenServiceModule } from '@/token-service/token-service.module';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';

import { PasswordResetController } from './password-reset.controller';
import { PasswordResetService } from './password-reset.service';

@Module({
	imports: [MailModule, TokenServiceModule],
	controllers: [PasswordResetController],
	providers: [PasswordResetService, UserService]
})
export class PasswordResetModule {}
