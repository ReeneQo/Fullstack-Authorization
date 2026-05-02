import z from 'zod'

export const addPasswordOauthSchema = z
	.object({
		password: z.string().min(6, 'Пароль минимум 6 символов'),
		passwordRepeat: z
			.string()
			.min(6, 'Пароль подтверждения, минимум 6 символов')
	})
	.refine(data => data.password === data.passwordRepeat, {
		message: 'Пароли должны совпадать',
		path: ['passwordRepeat']
	})

export type AddPassowordOauthData = z.infer<typeof addPasswordOauthSchema>
