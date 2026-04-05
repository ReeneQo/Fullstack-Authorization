import { forwardRef } from 'react';

import { AuthModule } from '@/auth/auth.module';
import { AuthService } from '@/auth/auth.service';
import { UserModule } from '@/user/user.module';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

@Module({
	imports: [AuthModule, UserModule],
	controllers: [TelegramController],
	providers: [TelegramService]
})
export class TelegramModule {}
