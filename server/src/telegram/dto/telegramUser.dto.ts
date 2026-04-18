import { IsNotEmpty, IsString } from 'class-validator';

export class TelegramUserDto {
	@IsString({ message: 'This field should be string' })
	@IsNotEmpty({ message: 'Field cant be empty' })
	first_name!: string;

	@IsString({ message: 'This field should be string' })
	@IsNotEmpty({ message: 'Field cant be empty' })
	username!: string;

	@IsString({ message: 'This field should be string' })
	@IsNotEmpty({ message: 'Field cant be empty' })
	photo_url!: string;

	@IsString({ message: 'This field should be string' })
	@IsNotEmpty({ message: 'Field cant be empty' })
	hash!: string;
}
