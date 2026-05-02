import { Authorization } from '@/auth/decorators/auth.decorator';
import { Authorized } from '@/auth/decorators/authorized.decorator';
import { AuthGuard } from '@/auth/guards/auth.guard';
import {
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	MaxFileSizeValidator,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AvatarService } from './avatar.service';

@Controller('user/avatar')
export class AvatarController {
	constructor(private readonly avatarService: AvatarService) {}

	@Post('upload')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('avatar'))
	async uploadAvatar(
		@Authorized('id') userId: string,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })
				]
			})
		)
		avatar: Express.Multer.File
	) {
		return this.avatarService.uploadAvatar(userId, avatar);
	}

	@Delete('delete')
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteAvatar(@Authorized('id') userId: string) {
		return this.avatarService.deleteAvatar(userId);
	}
}
