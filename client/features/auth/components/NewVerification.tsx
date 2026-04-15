'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { Loading } from '@/shared/components/ui'

import { useVerificationMutation } from '../hooks'

import { AuthWrapper } from './AuthWrapper'

export function NewVerification() {
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const { verification } = useVerificationMutation()

	useEffect(() => {
		verification(token)
	}, [token, verification])

	return (
		<AuthWrapper heading='Подтверждение почты'>
			<div>
				<Loading />
			</div>
		</AuthWrapper>
	)
}
