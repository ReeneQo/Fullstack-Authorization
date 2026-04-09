import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
	@IsString({ message: 'Token должен быть строкой' })
	@IsNotEmpty({ message: 'Поле токена не может быть пустым' })
	token: string;

	@IsString({ message: 'Поле должно быть строкой' })
	@IsNotEmpty({ message: 'Поле не может быть пустым' })
	@MinLength(6, { message: 'Минимум 6 символов' })
	password: string;
}
