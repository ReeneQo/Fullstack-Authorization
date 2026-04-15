import z from 'zod'

export const ChangePasswordSchema = z.object({
	password: z
		.string()
		.min(1, 'Пароль обязателен')
		.min(6, 'Минимум 6 символов')
})

export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>
