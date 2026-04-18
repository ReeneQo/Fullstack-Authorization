import { createClient } from 'redis';

import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: REDIS_CLIENT,
			useFactory: async (config: ConfigService) => {
				const client = createClient({
					url: config.getOrThrow<string>('REDIS_URI')
				});

				client.on('error', err => {
					console.error('Redis Client Error', err);
				});

				await client.connect();
				return client;
			},
			inject: [ConfigService]
		}
	],
	exports: [REDIS_CLIENT]
})
export class RedisModule {}
