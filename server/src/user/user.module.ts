import { EmailUpdateModule } from '@/email-update/email-update.module';
import { MailModule } from '@/libs/mail/mail.module';
import { MailConfirmationModule } from '@/mail-confirmation/mail-confirmation.module';
import { SessionsModule } from '@/sessions/sessions.module';
import { StorageModule } from '@/storage/storage.module';
import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [
		MailModule,
		MailConfirmationModule,
		SessionsModule,
		StorageModule,
		EmailUpdateModule
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
