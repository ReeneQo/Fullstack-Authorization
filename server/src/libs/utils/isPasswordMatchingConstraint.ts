import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator';

import { RegisterDto } from '@/auth/dto/register.dto';

@ValidatorConstraint({ name: 'IsPasswordMatching', async: false })
export class isPasswordMatchingConstraint implements ValidatorConstraintInterface {
	public validate(passwordRepeat: string, args: ValidationArguments) {
		const obj = args.object as RegisterDto;
		return obj.password === passwordRepeat;
	}
}
