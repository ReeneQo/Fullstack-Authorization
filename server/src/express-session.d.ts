import 'express-session';

// здесь с помощью declare модуль мы расширяем интерфейс express session что бы добавить туда userid для сохранения
declare module 'express-session' {
	interface SessionData {
		userId?: string;
		authId?: string;
	}
}
