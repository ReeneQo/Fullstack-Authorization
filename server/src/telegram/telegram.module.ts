import { SessionsModule } from '@/sessions/sessions.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';

import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

@Module({
	imports: [UserModule, SessionsModule],
	controllers: [TelegramController],
	providers: [TelegramService]
})
export class TelegramModule {}
