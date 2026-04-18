import { MailService } from '@/libs/mail/mail.service';
import { Module } from '@nestjs/common';

import { EmailUpdateService } from './email-update.service';

@Module({
	providers: [EmailUpdateService, MailService],
	exports: [EmailUpdateService]
})
export class EmailUpdateModule {}
