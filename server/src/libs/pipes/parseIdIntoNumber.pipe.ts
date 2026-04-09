/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
	ArgumentMetadata,
	BadRequestException,
	PipeTransform
} from '@nestjs/common';

export class ParseIdIntoNumber implements PipeTransform {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	transform(value: any, metadata: ArgumentMetadata): number {
		const val = parseInt(value);
		if (isNaN(val)) {
			throw new BadRequestException('NAN');
		}
		return val;
	}
}
