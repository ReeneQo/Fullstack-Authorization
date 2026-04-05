/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { UserRole } from 'generated/prisma/enums';

import { UserService } from '@/user/user.service';
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';

@Injectable()
export class IsAdmin implements CanActivate {
	constructor(private readonly userService: UserService) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException('User unauthorized pls login');
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const user = await this.userService.findById(request.session.userId);

		if (!user?.role.includes(UserRole.ADMIN)) {
			return false;
		}

		return true;
	}
}
