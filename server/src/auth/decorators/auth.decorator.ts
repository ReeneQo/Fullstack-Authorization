import { UserRole } from 'generated/prisma/enums';

import { applyDecorators, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/role.guard';

import { Roles } from './roles.decorator';

// authorization decorator который применяет проверку авторизации, либо с ролями либо без, обьединяет несколько других декораторов и гвардов
export const Authorization = (...roles: UserRole[]) => {
	// проверяем если есть роли
	if (roles.length > 0) {
		// делаем applyDecorators в котором применяем декоратор для установки ролей и два гуарда авторизации и роли
		return applyDecorators(
			Roles(...roles),
			UseGuards(AuthGuard, RolesGuard)
		);
	}
	// если роли не переданы просто проверяем авторизацию
	return applyDecorators(UseGuards(AuthGuard));
};
