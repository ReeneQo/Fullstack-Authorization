import { Metadata } from 'next'

import { UpdateEmailForm } from '@/features/dashboard/components'

export const metadata: Metadata = {
	title: 'Смена email'
}

export default function Home() {
	return <UpdateEmailForm />
}
