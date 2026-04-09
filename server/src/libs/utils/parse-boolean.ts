export function parseBoolean(str: string) {
	if (!str || typeof str !== 'string') {
		throw new Error('unccorect value');
	}

	const resultStr = str.toLowerCase().trim();

	if (resultStr === 'true') {
		return true;
	} else if (resultStr === 'false') {
		return false;
	} else {
		throw new Error(`error while transforming ${str} into boolean value`);
	}
}
