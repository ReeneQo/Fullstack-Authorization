import z from 'zod'

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/webp', 'image/png', 'image/jpeg']

export const AvatarSchema = z.object({
	avatar: z
		.instanceof(File, { message: 'Выберите файл' })
		.refine(file => file.size <= MAX_SIZE, 'Файл обязателен')
		.refine(
			file => ALLOWED_TYPES.includes((file as File)?.type),
			'Только webp, png, jpg'
		)
})

export type AvatarSchemaData = z.infer<typeof AvatarSchema>
