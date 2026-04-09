import { Request } from 'express';

import { ProviderService } from '@/provider/provider.service';
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	NotFoundException
} from '@nestjs/common';

@Injectable()
export class providerGuard implements CanActivate {
	constructor(private readonly providerService: ProviderService) {}

	canActivate(context: ExecutionContext): boolean {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		const request = context.switchToHttp().getRequest() as Request;

		const provider = request.params.provider;

		const providerInstance =
			this.providerService.findServiceByName(provider);

		if (!providerInstance) {
			throw new NotFoundException(`Provider ${provider} wasnt found`);
		}

		return true;
	}
}
