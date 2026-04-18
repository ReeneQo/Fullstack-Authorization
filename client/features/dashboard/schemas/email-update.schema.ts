import z from 'zod'

export const EmailUpdateRequestSchema = z.object({
	email: z.email('Неккоректный формат почты, пример: example@example.com')
})

export const EmailConfirmSchema = z.object({
	token: z.string().length(6, 'Код состоит из 6 цифр')
})

export type EmailUpdateRequestData = z.infer<typeof EmailUpdateRequestSchema>
export type EmailUpdateConfirmData = z.infer<typeof EmailConfirmSchema>
