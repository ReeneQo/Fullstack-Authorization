import { StorageModule } from '@/storage/storage.module';
import { Module } from '@nestjs/common';

import { UserModule } from '../user.module';

import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';

@Module({
	imports: [StorageModule, UserModule],
	controllers: [AvatarController],
	providers: [AvatarService],
	exports: [AvatarService]
})
export class AvatarModule {}
