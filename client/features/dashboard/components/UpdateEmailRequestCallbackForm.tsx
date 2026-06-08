'use client'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Loading
} from '@/shared/components/ui'
import { useProfile } from '@/shared/hooks/useProfile'

import { UpdateEmailRequestCallback } from './UpdateEmailRequestCallback'
import { UserButton, UserButtonLoading } from './UserButton'

export function UpdateEmailRequestCallbackForm() {
	const { user, isLoadingUser } = useProfile()

	if (!user) {
		return null
	}

	return (
		<Card className='w-full max-w-145'>
			<CardHeader className='flex flex-row items-center justify-between'>
				<CardTitle className='text-2xl'>Обновление почты</CardTitle>
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
					<div className='scrollbar-hidden mb-4 shrink-0 overflow-x-scroll text-lg'>
						Настоящая почта: {user.data.email}
					</div>
				)}

				<UpdateEmailRequestCallback />
			</CardContent>
		</Card>
	)
}
