import { Metadata } from 'next'

import { UpdateEmailRequestCallbackForm } from '@/features/dashboard/components/UpdateEmailRequestCallbackForm'

export const metadata: Metadata = {
	title: 'Смена email'
}

export default function Home() {
	return <UpdateEmailRequestCallbackForm />
}
