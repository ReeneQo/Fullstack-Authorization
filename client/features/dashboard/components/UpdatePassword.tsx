'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	FieldGroup,
	FormField,
	Loading
} from '@/shared/components/ui'
import { useProfile } from '@/shared/hooks/useProfile'

import { usePasswordUpdateMutation } from '../hooks'
import { PasswordUpdateData, passwordUpdateSchema } from '../schemas'

import { UserButton, UserButtonLoading } from './UserButton'

export function UpdatePasswordForm() {
	const { user, isLoadingUser } = useProfile()

	const form = useForm<PasswordUpdateData>({
		resolver: zodResolver(passwordUpdateSchema),
		defaultValues: {
			currentPassword: '',
			password: '',
			passwordRepeat: ''
		}
	})

	const { passwordUpdate, isLoadingPasswordUpdate } =
		usePasswordUpdateMutation()

	const onSubmit = (values: PasswordUpdateData) => {
		passwordUpdate(values)
	}

	if (!user) {
		return null
	}

	return (
		<Card className='w-full max-w-125'>
			<CardHeader className='flex flex-row items-center justify-between'>
				<CardTitle className='text-2xl'>Обновление пароля</CardTitle>
				{isLoadingUser ? (
					<UserButtonLoading />
				) : (
					<UserButton user={user.data} />
				)}
			</CardHeader>
			<CardContent>
				{isLoadingUser ? (
					<Loading />
				) : (
					<div className='mb-4 text-lg'>
						Приветствую, {user.data.displayName}
					</div>
				)}
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<FormField
							control={form.control}
							name='currentPassword'
							label='Настоящий пароль'
							placeholder='Настоящий пароль'
							isDisabled={
								isLoadingPasswordUpdate || isLoadingUser
							}
						/>
						<FormField
							control={form.control}
							name='password'
							label='Новый пароль'
							placeholder='Новый пароль'
							isDisabled={
								isLoadingPasswordUpdate || isLoadingUser
							}
						/>
						<FormField
							control={form.control}
							name='passwordRepeat'
							label='Подтвердите новый пароль'
							placeholder='Подтвердите новый пароль'
							isDisabled={
								isLoadingPasswordUpdate || isLoadingUser
							}
						/>
					</FieldGroup>
					<Button
						type='submit'
						disabled={isLoadingPasswordUpdate || isLoadingUser}
						className='mt-4 w-full'
						variant='outline'
					>
						Обновить пароль
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
