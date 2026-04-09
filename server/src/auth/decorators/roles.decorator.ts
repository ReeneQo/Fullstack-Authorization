import { UserRole } from 'generated/prisma/enums';

import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// создаем декоратор roles что бы устанавливать роли пользователю
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
