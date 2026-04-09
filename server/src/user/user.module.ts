import { MailModule } from '@/libs/mail/mail.module';
import { MailConfirmationModule } from '@/mail-confirmation/mail-confirmation.module';
import { SessionsModule } from '@/sessions/sessions.module';
import { forwardRef, Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [MailModule, MailConfirmationModule, SessionsModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
