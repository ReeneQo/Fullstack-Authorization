'use client'

import { Skeleton } from '@/shared/components/ui'
import { useProfile } from '@/shared/hooks/useProfile'

import { AddOauthPassword } from './AddOauthPassword'
import { UpdatePasswordForm } from './UpdatePassword'

export const PasswordSettings = () => {
	const { user, isLoadingUser } = useProfile()
	if (isLoadingUser) return <Skeleton />
	if (!user) {
		return null
	}
	return user.data.password !== null ? (
		<UpdatePasswordForm />
	) : (
		<AddOauthPassword />
	)
}
