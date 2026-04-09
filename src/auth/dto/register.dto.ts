import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
	Validate
} from 'class-validator';

import { isPasswordMatchingConstraint } from '@/libs/utils/isPasswordMatchingContstraint';

// dtoшка через класс и библиотеку class validator
export class RegisterDto {
	// name со свойствами isString - проверяет что бы тип данных был строкой, и свойством notEmpty которая проверяет что поле не пустое
	@IsString({ message: 'Поле должно быть строкой' })
	@IsNotEmpty({ message: 'Поле не может быть пустым' })
	name: string;

	// емейл с новым свойством isEmail который является уникальным декоратором для почты
	@IsString({ message: 'Поле должно быть строкой' })
	@IsNotEmpty({ message: 'Поле не может быть пустым' })
	@IsEmail(
		{},
		{ message: 'Неверный формат почты пример: example@example.com' }
	)
	email: string;

	@IsString({ message: 'Поле должно быть строкой' })
	@IsNotEmpty({ message: 'Поле не может быть пустым' })
	@MinLength(6, { message: 'Минимум 6 символов' })
	password: string;

	@IsString({ message: 'Поле должно быть строкой' })
	@IsNotEmpty({ message: 'Поле не может быть пустым' })
	@MinLength(6, { message: 'Минимум 6 символов' })
	@Validate(isPasswordMatchingConstraint, { message: 'Пароли не совпадают' })
	passwordRepeat: string;
}
