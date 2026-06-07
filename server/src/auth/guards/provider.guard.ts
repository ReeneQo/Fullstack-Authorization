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
		const request = context.switchToHttp().getRequest() as Request;

		const provider = request.params.provider;

		const providerName = Array.isArray(provider) ? provider[0] : provider;

		const providerInstance =
			this.providerService.findServiceByName(providerName);

		if (!providerInstance) {
			throw new NotFoundException(`Провайдер: ${provider} не был найден`);
		}

		return true;
	}
}
