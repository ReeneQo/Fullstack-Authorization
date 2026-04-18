import { Metadata } from 'next'

import { NewVerification } from '@/features/auth/components'

export const metadata: Metadata = {
	title: 'Подтверждение почты'
}

export default function NewVerificationPage() {
	return <NewVerification />
}
