'use client'
import { Skeleton } from '@/shared/components/ui'
import { useProfile } from '@/shared/hooks/useProfile'

import { DashboardNav } from '@/widgets'

export function DashboardShell({ children }: { children: React.ReactNode }) {
	const { user, isLoadingUser } = useProfile()

	if (isLoadingUser || !user) {
		return (
			<div className='w-full max-w-145 space-y-2'>
				<Skeleton className='h-96 w-full' />
			</div>
		)
	}

	return (
		<>
			<DashboardNav />
			{children}
		</>
	)
}
