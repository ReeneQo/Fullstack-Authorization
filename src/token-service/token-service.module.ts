import { Global, Module } from '@nestjs/common';

import { TokenService } from './token-service.service';

@Global()
@Module({
	providers: [TokenService],
	exports: [TokenService]
})
export class TokenServiceModule {}
