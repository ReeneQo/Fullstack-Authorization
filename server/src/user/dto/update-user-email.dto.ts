import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UpdateUserEmailDto {
	@IsString({ message: 'Email должен быть строкой' })
	@IsNotEmpty({ message: 'Email не может быть пустым' })
	@IsEmail(
		{},
		{ message: 'Неверный формат почты пример: example@example.com' }
	)
	email: string;
}
