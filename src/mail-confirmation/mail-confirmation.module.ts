import { AuthModule } from '@/auth/auth.module';
import { MailModule } from '@/libs/mail/mail.module';
import { UserService } from '@/user/user.service';
import { forwardRef, Module } from '@nestjs/common';

import { MailConfirmationController } from './mail-confirmation.controller';
import { MailConfirmationService } from './mail-confirmation.service';

@Module({
	imports: [MailModule, forwardRef(() => AuthModule)],
	controllers: [MailConfirmationController],
	providers: [MailConfirmationService, UserService],
	exports: [MailConfirmationService]
})
export class MailConfirmationModule {}
