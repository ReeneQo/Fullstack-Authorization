import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator';

// dtoшка через класс и библиотеку class validator
export class LoginDto {
	// емейл с новым свойством isEmail который является уникальным декоратором для почты
	@IsString({ message: 'Поле должно быть строкой' })
	@IsNotEmpty({ message: 'Поле не может быть пустым' })
	@IsEmail(
		{},
		{ message: 'Неверный формат почты пример: example@example.com' }
	)
	email: string;

	// min lenght - проверяет мин длину
	@IsString({ message: 'Поле должно быть строкой' })
	@IsNotEmpty({ message: 'Поле не может быть пустым' })
	@MinLength(6, { message: 'Минимум 6 символов' })
	password: string;

	@IsOptional()
	@IsString()
	code: string;
}
