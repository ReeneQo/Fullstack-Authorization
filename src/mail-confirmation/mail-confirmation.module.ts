import { MailModule } from '@/libs/mail/mail.module';
import { SessionsModule } from '@/sessions/sessions.module';
import { TokenServiceModule } from '@/token-service/token-service.module';
import { Module } from '@nestjs/common';

import { MailConfirmationController } from './mail-confirmation.controller';
import { MailConfirmationService } from './mail-confirmation.service';

@Module({
	imports: [MailModule, TokenServiceModule, SessionsModule],
	controllers: [MailConfirmationController],
	providers: [MailConfirmationService],
	exports: [MailConfirmationService]
})
export class MailConfirmationModule {}
