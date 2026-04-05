import { UserRole } from 'generated/prisma/enums';

import { Authorization } from '@/auth/decorators/auth.decorator';
import { Authorized } from '@/auth/decorators/authorized.decorator';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Authorization(UserRole.REGULAR)
	@HttpCode(HttpStatus.OK)
	@Get('profile')
	async getUser(@Authorized('id') userId: string) {
		return this.userService.findById(userId);
	}

	@Authorization(UserRole.REGULAR)
	@HttpCode(HttpStatus.OK)
	@Get('by-id/:id')
	async getUserById(@Param('id') id: string) {
		return this.userService.findById(id);
	}

	@Get('test')
	getTest() {
		return {
			esdsds: 'dsds'
		};
	}
}
