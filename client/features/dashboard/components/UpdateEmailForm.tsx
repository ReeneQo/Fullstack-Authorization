'use client'

import { useState } from 'react'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Loading
} from '@/shared/components/ui'
import { useProfile } from '@/shared/hooks/useProfile'

import { UpdateEmailConfirmForm } from './UpdateEmailConfirmForm'
import { UpdateEmailRequestForm } from './UpdateEmailRequestForm'
import { UserButton, UserButtonLoading } from './UserButton'

export function UpdateEmailForm() {
	const { user, isLoadingUser } = useProfile()
	const [step, setStep] = useState<'email' | 'code'>('email')

	if (!user) {
		return null
	}

	return (
		<Card className='w-full max-w-125'>
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

				{step === 'email' ? (
					<UpdateEmailRequestForm setStep={setStep} />
				) : (
					<UpdateEmailConfirmForm />
				)}
			</CardContent>
		</Card>
	)
}
