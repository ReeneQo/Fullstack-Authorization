import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class toLowerCasePipe implements PipeTransform {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	transform(value: any, metadata: ArgumentMetadata) {
		if (typeof value === 'string') {
			return value.toLocaleLowerCase();
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return value;
	}
}
