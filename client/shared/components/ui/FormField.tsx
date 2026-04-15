// components/ui/form-field.tsx
'use client'

import {
	type Control,
	Controller,
	type FieldValues,
	type Path
} from 'react-hook-form'

import { Field, FieldError, FieldLabel } from './Field'
import { Input } from './Input'

interface FormFieldProps<T extends FieldValues> {
	control: Control<T>
	name: Path<T>
	label: string
	placeholder?: string
	type?: string
	autoComplete?: string
	isDisabled?: boolean
}

export function FormField<T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	type = 'text',
	autoComplete,
	isDisabled
}: FormFieldProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
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
