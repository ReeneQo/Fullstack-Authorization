import { EmailUpdateModule } from '@/email-update/email-update.module';
import { MailModule } from '@/libs/mail/mail.module';
import { MailConfirmationModule } from '@/mail-confirmation/mail-confirmation.module';
import { SessionsModule } from '@/sessions/sessions.module';
import { StorageModule } from '@/storage/storage.module';
import { forwardRef, Module } from '@nestjs/common';

import { AvatarModule } from './avatar/avatar.module';
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
