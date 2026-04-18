import 'express-session';

import { User } from '../generated/prisma/client';

declare module 'express-session' {
	interface SessionData {
		userId?: string;
		authId?: string;
	}
}

declare module 'express-serve-static-core' {
	interface Request {
		user?: User;
	}
}
