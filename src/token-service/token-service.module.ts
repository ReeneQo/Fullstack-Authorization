import { Module } from '@nestjs/common';

import { TokenService } from './token-service.service';

@Module({
	providers: [TokenService],
	exports: [TokenService]
})
export class TokenServiceModule {}
