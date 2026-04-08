import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestPasswordResetDto {
	@IsString({ message: 'Поле должно быть строкой' })
	@IsNotEmpty({ message: 'Поле не может быть пустым' })
	@IsEmail({}, { message: 'Неверный формат почты пример: example@example.com' })
	email: string;
}
