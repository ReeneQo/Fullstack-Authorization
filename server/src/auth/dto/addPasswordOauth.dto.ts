import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';

import { isPasswordMatchingConstraint } from '@/libs/utils/isPasswordMatchingConstraint';

export class AddPasswordOauthDto {
	@IsString({ message: 'Поле должно быть строкой' })
	@IsNotEmpty({ message: 'Поле не может быть пустым' })
	@MinLength(6, { message: 'Минимум 6 символов' })
	password!: string;

	@IsString({ message: 'Поле должно быть строкой' })
	@IsNotEmpty({ message: 'Поле не может быть пустым' })
	@MinLength(6, { message: 'Минимум 6 символов' })
	@Validate(isPasswordMatchingConstraint, { message: 'Пароли не совпадают' })
	passwordRepeat!: string;
}
