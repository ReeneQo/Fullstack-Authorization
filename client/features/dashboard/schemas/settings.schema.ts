import z from 'zod'

export const SettingsUserSchema = z.object({
	name: z.string().min(1, 'Имя должно быть заполнено'),
	isTwoFactorEnabled: z.boolean()
})

export type SettingsUserData = z.infer<typeof SettingsUserSchema>
