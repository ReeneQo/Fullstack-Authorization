'use client'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Loading,
	Skeleton
} from '@/shared/components/ui'
import { useProfile } from '@/shared/hooks/useProfile'

import { UpdateEmailConfirmForm } from './UpdateEmailConfirmForm'
import { UpdateEmailRequestForm } from './UpdateEmailRequestForm'

export function UpdateEmailForm() {
	const { user, isLoadingUser } = useProfile()
	const [step, setStep] = useState<'email' | 'code'>('email')
	const searchParams = useSearchParams()
	const tokenCallback = searchParams.get('token')

	if (isLoadingUser || !user) {
		return (
			<div className='w-full max-w-145 space-y-2'>
				<Skeleton className='h-[235px] w-full' />
			</div>
		)
	}

	if (!tokenCallback) return null

	return (
		<Card className='w-full max-w-145'>
			<CardHeader className='flex flex-row items-center justify-between'>
				<CardTitle className='text-2xl'>Обновление почты</CardTitle>
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
					<UpdateEmailRequestForm
						setStep={setStep}
						tokenCallback={tokenCallback}
					/>
				) : (
					<UpdateEmailConfirmForm tokenCallback={tokenCallback} />
				)}
			</CardContent>
		</Card>
	)
}
