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

import { useAddPasswordOauthMutation } from '../hooks/useAddPasswordOauth'
import { AddPassowordOauthData, addPasswordOauthSchema } from '../schemas'

import { UserButton, UserButtonLoading } from './UserButton'

export function AddOauthPassword() {
	const { user, isLoadingUser } = useProfile()

	const form = useForm<AddPassowordOauthData>({
		resolver: zodResolver(addPasswordOauthSchema),
		defaultValues: {
			password: '',
			passwordRepeat: ''
		}
	})

	const { passwordAdd, isLoadingPasswordAdd } = useAddPasswordOauthMutation()

	const onSubmit = (values: AddPassowordOauthData) => {
		passwordAdd(values)
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
							name='password'
							label='Добавьте пароль'
							placeholder='Добавьте пароль'
							isDisabled={isLoadingPasswordAdd || isLoadingUser}
						/>
						<FormField
							control={form.control}
							name='passwordRepeat'
							label='Подтвердите пароль'
							placeholder='Подтвердите пароль'
							isDisabled={isLoadingPasswordAdd || isLoadingUser}
						/>
					</FieldGroup>
					<Button
						type='submit'
						disabled={isLoadingPasswordAdd || isLoadingUser}
						className='mt-4 w-full'
						variant='outline'
					>
						Добавить пароль
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
