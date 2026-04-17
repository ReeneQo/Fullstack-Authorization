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

import { useUpdateProfileMutation } from '../hooks/useUpdateProfileMutation'
import { SettingsUserData, SettingsUserSchema } from '../schemas'

import { UserButton, UserButtonLoading } from './UserButton'

export function SettingsForm() {
	const { user, isLoadingUser } = useProfile()

	const form = useForm<SettingsUserData>({
		resolver: zodResolver(SettingsUserSchema),
		values: {
			name: user?.data.displayName || '',
			isTwoFactorEnabled: user?.data.isTwoFactorEnabled || false
		}
	})

	const { updateProfile, isLoadingUpdate } = useUpdateProfileMutation()

	const onSubmit = (values: SettingsUserData) => {
		updateProfile(values)
	}

	if (!user) {
		return null
	}

	return (
		<Card className='w-125'>
			<CardHeader className='flex flex-row items-center justify-between'>
				<CardTitle className='text-2xl'>Настройки профиля</CardTitle>
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
							name='name'
							label='Имя'
							placeholder='Ваше имя'
							autoComplete='name'
							isDisabled={isLoadingUpdate || isLoadingUser}
						/>

						<div className='flex flex-row items-center justify-between space-x-5 rounded-lg border p-3'>
							<div className='space-y-1'>
								<h2 className='font-bold'>
									Двухфакторная аутентификация
								</h2>
								<p className='text-[14px] font-normal text-balance text-gray-400'>
									Включите двухфакторную аутентификацию для
									вашей учетной записи
								</p>
							</div>
							<div>
								<FormField
									control={form.control}
									name='isTwoFactorEnabled'
									type='switch'
									isDisabled={
										isLoadingUpdate || isLoadingUser
									}
								/>
							</div>
						</div>
					</FieldGroup>
					<Button
						type='submit'
						disabled={isLoadingUpdate || isLoadingUser}
						className='mt-4 w-full'
						variant='outline'
					>
						Сохранить данные
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
