import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsString({ message: 'Имя должно быть строкой' })
	@IsNotEmpty({ message: 'Имя обязательно для заполнения' })
	name?: string;

	@IsOptional()
	@IsBoolean({ message: '2FA должно быть булево значением' })
	isTwoFactorEnabled?: boolean;
}
