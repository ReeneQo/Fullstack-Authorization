export function parseMs(str: string): number {
	const units: Record<string, number> = {
		ms: 1,
		millisecond: 1,
		milliseconds: 1,
		s: 1000,
		sec: 1000,
		second: 1000,
		seconds: 1000,
		m: 60000,
		min: 60000,
		minute: 60000,
		minutes: 60000,
		h: 3600000,
		hour: 3600000,
		hours: 3600000,
		d: 86400000,
		day: 86400000,
		days: 86400000
	};

	const timeStr = str.toLowerCase().trim();

	let matchedUnit = '';
	let maxMatchLength = 0;

	for (const [unit] of Object.entries(units)) {
		if (timeStr.endsWith(unit) && unit.length > maxMatchLength) {
			maxMatchLength = unit.length;
			matchedUnit = unit;
		}
	}

	if (matchedUnit) {
		const numStr = timeStr.slice(0, -matchedUnit.length);
		const num = parseFloat(numStr);
		if (!isNaN(num)) {
			return Math.floor(num * units[matchedUnit]);
		}
	}

	const num = parseFloat(timeStr);
	if (!isNaN(num)) {
		return Math.floor(num * 1000);
	}

	throw new Error(
		`Неверный формат времени: ${str}. Примеры: '1h', '30m', '1.5s'`
	);
}
