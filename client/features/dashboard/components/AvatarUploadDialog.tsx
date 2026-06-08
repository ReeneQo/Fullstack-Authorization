'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Field,
	FieldError,
	FieldGroup
} from '@/shared/components/ui'

import { useAvatarUploadMutation } from '../hooks'
import { AvatarSchema, AvatarSchemaData } from '../schemas'

export function AvatarUploadDialog({
	isOpen,
	setIsOpen
}: {
	isOpen: boolean
	setIsOpen: Dispatch<SetStateAction<boolean>>
}) {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [preview, setPreview] = useState<string | null>(null)

	const form = useForm<AvatarSchemaData>({
		resolver: zodResolver(AvatarSchema),
		defaultValues: { avatar: undefined }
	})

	const { avatarUpload, isLoadingAvatarUpload } = useAvatarUploadMutation(
		setIsOpen,
		form
	)

	useEffect(() => {
		return () => {
			if (preview) URL.revokeObjectURL(preview)
		}
	}, [preview])

	const onSubmit = (values: AvatarSchemaData) => {
		avatarUpload(values)
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Загрузка аватара</DialogTitle>
					<DialogDescription>
						Выберите изображение. Поддерживаются JPEG, PNG, WebP до
						5 МБ.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name='avatar'
							control={form.control}
							render={({ field: { onChange }, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<div className='flex justify-center'>
										<button
											type='button'
											onClick={() =>
												fileInputRef.current?.click()
											}
											disabled={isLoadingAvatarUpload}
											className='border-muted-foreground/40 hover:border-muted-foreground relative size-32 overflow-hidden rounded-full border-2 border-dashed transition disabled:opacity-50'
										>
											{preview ? (
												<img
													src={preview}
													alt='Превью аватара'
													className='size-full object-cover'
												/>
											) : (
												<div className='text-muted-foreground flex size-full flex-col items-center justify-center gap-1'>
													<Camera className='size-6' />
													<span className='text-xs'>
														Выбрать
													</span>
												</div>
											)}
										</button>

										<input
											ref={fileInputRef}
											type='file'
											accept='image/jpeg,image/png,image/webp'
											className='hidden'
											disabled={isLoadingAvatarUpload}
											onChange={event => {
												const file =
													event.target.files?.[0]
												if (!file) return

												if (preview)
													URL.revokeObjectURL(preview)
												setPreview(
													URL.createObjectURL(file)
												)
												onChange(file)
											}}
										/>
									</div>

									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
					</FieldGroup>

					<Button
						type='submit'
						disabled={isLoadingAvatarUpload}
						className='mt-4 w-full'
						variant='outline'
					>
						Сохранить
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
