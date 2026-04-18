import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UpdateUserEmailTokenDto {
	@IsString({ message: 'Код должен быть строкой' })
	@IsNotEmpty({ message: 'Код обязателен' })
	@Length(6, 6, { message: 'Код должен состоять из 6 символов' })
	@Matches(/^\d+$/, { message: 'Код должен содержать только цифры' })
	token: string;
}
