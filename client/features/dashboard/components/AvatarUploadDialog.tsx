'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, SetStateAction } from 'react'
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
	FieldGroup,
	FieldLabel,
	Input
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
	const form = useForm<AvatarSchemaData>({
		resolver: zodResolver(AvatarSchema),
		defaultValues: {
			avatar: undefined
		}
	})

	const { avatarUpload, isLoadingAvatarUpload } = useAvatarUploadMutation()

	const onSubmit = (values: AvatarSchemaData) => {
		console.log(values)
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
							name={'avatar'}
							control={form.control}
							render={({
								field: { onChange, value, ...fieldProps },
								fieldState
							}) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={'avatar'}>
										Аватар
									</FieldLabel>

									<Input
										{...fieldProps}
										id='avatar'
										type='file'
										accept='image/jpeg,image/png,image/webp'
										disabled={isLoadingAvatarUpload}
										aria-invalid={fieldState.invalid}
										onChange={event => {
											const file = event.target.files?.[0]
											onChange(file)
										}}
									/>
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
						// disabled={isLoadingUpdate || isLoadingUser}
						className='mt-4 w-full'
						variant='outline'
					>
						Сохранить данные
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
