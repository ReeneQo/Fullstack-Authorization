import z from 'zod'

export const EmailUpdateRequestSchema = z.object({
	email: z.email('Некорректный формат почты, пример: example@example.com')
})

export const EmailConfirmSchema = z.object({
	token: z.string().length(6, 'Код состоит из 6 цифр')
})

export type EmailUpdateRequestFormData = z.infer<
	typeof EmailUpdateRequestSchema
>
export type EmailUpdateRequestData = EmailUpdateRequestFormData & {
	tokenCallback: string
}

export type EmailUpdateConfirmFormData = z.infer<typeof EmailConfirmSchema>
export type EmailUpdateConfirmData = EmailUpdateConfirmFormData & {
	tokenCallback: string
}
