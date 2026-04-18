import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator';

export class LoginDto {
	@IsString({ message: 'Поле должно быть строкой' })
	@IsNotEmpty({ message: 'Поле не может быть пустым' })
	@IsEmail(
		{},
		{ message: 'Неверный формат почты пример: example@example.com' }
	)
	email!: string;

	@IsString({ message: 'Поле должно быть строкой' })
	@IsNotEmpty({ message: 'Поле не может быть пустым' })
	@MinLength(6, { message: 'Минимум 6 символов' })
	password!: string;

	@IsOptional()
	@IsString()
	code!: string;
}
