import z from 'zod'

export const RegisterSchema = z
	.object({
		name: z.string().min(1, 'Имя должно быть заполнено'),
		email: z.email(
			'Неккоректный формат почты, пример: example@example.com'
		),
		password: z.string().min(6, 'Пароль минимум 6 символов'),
		passwordRepeat: z
			.string()
			.min(6, 'Пароль подтверждения, минимум 6 символов')
	})
	.refine(data => data.password === data.passwordRepeat, {
		message: 'Пароли должны совпадать',
		path: ['passwordRepeat']
	})

export type RegisterFormData = z.infer<typeof RegisterSchema>
