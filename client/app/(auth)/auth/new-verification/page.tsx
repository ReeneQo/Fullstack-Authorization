import { Metadata } from 'next'
import { Suspense } from 'react'

import { NewVerification } from '@/features/auth/components'
import { Loading } from '@/shared/components/ui'

export const metadata: Metadata = {
	title: 'Подтверждение почты'
}

export default function NewVerificationPage() {
	return (
		<Suspense fallback={<Loading />}>
			<NewVerification />
		</Suspense>
	)
}
