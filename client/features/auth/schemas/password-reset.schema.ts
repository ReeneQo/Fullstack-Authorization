import z from 'zod'

export const PasswordResetSchema = z.object({
	email: z.email('Неккоректный формат почты, пример: example@example.com')
})

export type PasswordResetData = z.infer<typeof PasswordResetSchema>
