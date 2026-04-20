import {
	CreateBucketCommand,
	DeleteObjectCommand,
	GetObjectCommand,
	HeadBucketCommand,
	PutObjectCommand,
	S3Client,
	S3ServiceException
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
	Injectable,
	InternalServerErrorException,
	OnModuleInit
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService implements OnModuleInit {
	private readonly s3: S3Client;
	private readonly avatarsBucket: string;

	constructor(private readonly configService: ConfigService) {
		this.s3 = new S3Client({
			endpoint: this.configService.getOrThrow<string>('storage.endpoint'),
			region: this.configService.getOrThrow<string>('storage.region'),
			credentials: {
				accessKeyId:
					this.configService.getOrThrow<string>('storage.accessKey'),
				secretAccessKey:
					this.configService.getOrThrow<string>('storage.secretKey')
			},
			forcePathStyle: true // КРИТИЧНО для MinIO
		});

		this.avatarsBucket = this.configService.getOrThrow<string>(
			'storage.avatarsBucket'
		);
	}

	async onModuleInit() {
		await this.ensureBucketExist(this.avatarsBucket);
	}

	private isBucketNotFoundError(error: unknown): error is S3ServiceException {
		return (
			error instanceof S3ServiceException &&
			(error.name === 'NotFound' ||
				error.$metadata?.httpStatusCode === 404)
		);
	}

	private async ensureBucketExist(bucketName: string) {
		try {
			await this.s3.send(new HeadBucketCommand({ Bucket: bucketName }));
		} catch (error) {
			if (this.isBucketNotFoundError(error)) {
				await this.createBucket(bucketName);
			} else {
				throw new InternalServerErrorException(
					'Сервис поиска недоступен'
				);
			}
		}
	}

	private async createBucket(bucketName: string) {
		try {
			await this.s3.send(new CreateBucketCommand({ Bucket: bucketName }));
		} catch (error) {
			throw new InternalServerErrorException(
				'Ошибка во время создания бакета'
			);
		}
	}

	public async upload(
		key: string,
		body: Buffer,
		contentType: string
	): Promise<void> {
		try {
			await this.s3.send(
				new PutObjectCommand({
					Bucket: this.avatarsBucket,
					Key: key,
					Body: body,
					ContentType: contentType
				})
			);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ошибка во время загрузки файла'
			);
		}
	}

	public async delete(key: string) {
		try {
			await this.s3.send(
				new DeleteObjectCommand({
					Key: key,
					Bucket: this.avatarsBucket
				})
			);
		} catch (error) {}
	}

	public async getPresignedUrl(
		key: string,
		expiresInSeconds = 900
	): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: this.avatarsBucket,
			Key: key
		});

		return getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
	}
}
