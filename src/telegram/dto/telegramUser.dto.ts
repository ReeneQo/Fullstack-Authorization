import { IsNotEmpty, IsString } from 'class-validator';

// dtoшка через класс и библиотеку class validator
export class TelegramUserDto {
	// name со свойствами isString - проверяет что бы тип данных был строкой, и свойством notEmpty которая проверяет что поле не пустое

	// @IsString({ message: 'This field should be string' })
	// @IsNotEmpty({ message: 'Field cant be empty' })
	// id: string;

	// @IsString({ message: 'This field should be string' })
	// @IsNotEmpty({ message: 'Field cant be empty' })
	// auth_date: string;

	@IsString({ message: 'This field should be string' })
	@IsNotEmpty({ message: 'Field cant be empty' })
	first_name: string;

	@IsString({ message: 'This field should be string' })
	@IsNotEmpty({ message: 'Field cant be empty' })
	username: string;

	@IsString({ message: 'This field should be string' })
	@IsNotEmpty({ message: 'Field cant be empty' })
	photo_url: string;

	@IsString({ message: 'This field should be string' })
	@IsNotEmpty({ message: 'Field cant be empty' })
	hash: string;
}
