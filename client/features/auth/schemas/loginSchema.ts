import z from 'zod'

export const LoginSchema = z.object({
	email: z
		.string()
		.email('Неккоректный формат почты, пример: example@example.com')
		.min(1, 'Email обязателен'),
	password: z
		.string()
		.min(1, 'Пароль обязателен')
		.min(6, 'Минимум 6 символов')
})

export type LoginFormData = z.infer<typeof LoginSchema>
