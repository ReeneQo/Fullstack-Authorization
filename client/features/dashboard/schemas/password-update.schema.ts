import z from 'zod'

export const passwordUpdateSchema = z
	.object({
		currentPassword: z.string().min(6, 'Пароль минимум 6 символов'),
		password: z.string().min(6, 'Пароль минимум 6 символов'),
		passwordRepeat: z
			.string()
			.min(6, 'Пароль подтверждения, минимум 6 символов')
	})
	.refine(data => data.password === data.passwordRepeat, {
		message: 'Пароли должны совпадать',
		path: ['passwordRepeat']
	})

export type PasswordUpdateData = z.infer<typeof passwordUpdateSchema>
