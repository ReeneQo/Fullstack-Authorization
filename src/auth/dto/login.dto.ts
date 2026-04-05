import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// dtoшка через класс и библиотеку class validator
export class LoginDto {
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
}
