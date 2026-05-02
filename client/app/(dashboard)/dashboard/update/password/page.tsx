import { Metadata } from 'next'

import {
	AddOauthPassword,
	UpdatePasswordForm
} from '@/features/dashboard/components'

export const metadata: Metadata = {
	title: 'Смена пароля'
}

export default function Home() {
	return <AddOauthPassword />
}
