// components/ui/form-field.tsx
'use client'

import Link from 'next/link'
import {
	type Control,
	Controller,
	type FieldValues,
	type Path
} from 'react-hook-form'

import { Field, FieldError, FieldLabel } from './Field'
import { Input } from './Input'
import { routes } from '@/core/configs/routes'

interface FormFieldProps<T extends FieldValues> {
	control: Control<T>
	name: Path<T>
	label: string
	placeholder?: string
	type?: string
	autoComplete?: string
	isDisabled?: boolean
	forgetPassword?: boolean
}

export function FormField<T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	type = 'text',
	autoComplete,
	isDisabled,
	forgetPassword
}: FormFieldProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					{forgetPassword ? (
						<div className='flex items-center justify-between'>
							<FieldLabel htmlFor={field.name}>
								{label}
							</FieldLabel>
							<Link
								href={routes.passwordReset.page}
								className='mt-auto inline-block text-sm underline'
							>
								Забыли пароль?
							</Link>
						</div>
					) : (
						<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
					)}
					<Input
						{...field}
						id={field.name}
						type={type}
						aria-invalid={fieldState.invalid}
						placeholder={placeholder}
						autoComplete={autoComplete}
						disabled={isDisabled}
					/>
					{fieldState.invalid && (
						<FieldError errors={[fieldState.error]} />
					)}
				</Field>
			)}
		/>
	)
}
