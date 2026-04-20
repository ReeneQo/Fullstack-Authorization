import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import uuid from 'uuid';

import { PrismaService } from '@/prisma/prisma.service';
import { StorageService } from '@/storage/storage.service';
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common';

@Injectable()
export class AvatarService {
	private readonly allowedMimedTypes = [
		'image/jpeg',
		'image/png',
		'image/webp'
	];
	private readonly allowedFileSize = 5 * 1024 * 1024;

	public constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService
	) {}

	public async uploadAvatar(userId: string, file: Express.Multer.File) {
		if (file.size > this.allowedFileSize) {
			throw new BadRequestException(
				`Размер файла слишком большой, максимальный размер - ${this.allowedFileSize}`
			);
		}

		const detectedType = await fileTypeFromBuffer(file.buffer);

		if (
			!detectedType ||
			!this.allowedMimedTypes.includes(detectedType.mime)
		) {
			throw new BadRequestException(
				`Недопустимый формат файла, допустимые форматы. ${this.allowedMimedTypes.join('')}`
			);
		}

		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
			select: { id: true, avatarKey: true }
		});

		if (!user) {
			throw new NotFoundException('Пользователь не найден');
		}

		const processedBuffer = await sharp(file.buffer)
			.resize(256, 256, {
				fit: 'cover',
				position: 'center'
			})
			.webp({ quality: 85 })
			.toBuffer();

		const newKey = `avatar/user/${userId}/${uuid.v4()}.webp`;

		await this.storageService.upload(newKey, processedBuffer, 'image/webp');

		await this.prismaService.user.update({
			where: { id: userId },
			data: {
				avatarKey: newKey
			}
		});

		if (user.avatarKey) {
			await this.storageService.delete(user.avatarKey);
		}

		const avatarUrl = await this.storageService.getPresignedUrl(newKey);

		return { avatarUrl };
	}

	public async deleteAvatar(userId: string) {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
			select: { avatarKey: true }
		});

		if (!user) {
			throw new NotFoundException('Пользователь не найден');
		}

		if (!user.avatarKey) {
			throw new BadRequestException('Аватар не установлен');
		}

		await this.prismaService.user.update({
			where: { id: userId },
			data: { avatarKey: null }
		});

		await this.storageService.delete(user.avatarKey);
	}
}
