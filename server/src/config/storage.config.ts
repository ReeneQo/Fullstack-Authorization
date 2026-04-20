import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
	endpoint: process.env.MINIO_ENDPOINT,
	region: process.env.MINIO_REGION,
	accessKey: process.env.MINIO_ROOT_USER,
	secretKey: process.env.MINIO_ROOT_PASSWORD,
	avatarsBucket: process.env.MINIO_BUCKET_AVATARS
}));
