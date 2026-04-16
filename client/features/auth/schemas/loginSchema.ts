import z from 'zod'

export const LoginSchema = z.object({
	email: z.email('Неккоректный формат почты, пример: example@example.com'),
	password: z
		.string()
		.min(1, 'Пароль обязателен')
		.min(6, 'Минимум 6 символов'),
	code: z.optional(z.string())
})

export type LoginFormData = z.infer<typeof LoginSchema>
