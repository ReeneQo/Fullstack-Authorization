import { Metadata } from 'next'

import { PasswordSettings } from '@/features/dashboard/components'

export const metadata: Metadata = {
	title: 'Смена пароля'
}

export default function Home() {
	return <PasswordSettings />
}
