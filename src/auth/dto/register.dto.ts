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
	@IsString({ message: 'This field should be string' })
	@IsNotEmpty({ message: 'Field cant be empty' })
	name: string;

	// емейл с новым свойством isEmail который является уникальным декоратором для почты
	@IsString({ message: 'This field should be string' })
	@IsNotEmpty({ message: 'Field cant be empty' })
	@IsEmail({}, { message: 'Incorrect mail format' })
	email: string;

	// min lenght - проверяет мин длину
	@IsString({ message: 'This field should be string' })
	@IsNotEmpty({ message: 'Field cant be empty' })
	@MinLength(6, { message: 'minimum 6 characters' })
	password: string;

	@IsString({ message: 'This field should be string' })
	@IsNotEmpty({ message: 'Field cant be empty' })
	@MinLength(6, { message: 'minimum 6 characters' })
	// используем специальную утилку что бы проверять совпадение паролей иначе кидает ошибку
	@Validate(isPasswordMatchingConstraint, { message: 'password dont match' })
	passwordRepeat: string;
}
