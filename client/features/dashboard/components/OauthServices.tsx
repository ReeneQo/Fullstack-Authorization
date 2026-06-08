'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import { toast } from 'sonner'

import { OauthProviders } from '@/features/auth/types'

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Loading
} from '@/shared/components/ui'
import { useProfile } from '@/shared/hooks/useProfile'

import { useOauthLinkMutation } from '../hooks/useLinkProviderMutation'
import { useUnlinkMutation } from '../hooks/useUnlinkProviderMutation'

import { UserButton, UserButtonLoading } from './UserButton'

const PROVIDERS: {
	id: OauthProviders
	label: string
	icon: React.ReactNode
}[] = [
	{ id: 'google', label: 'Google', icon: <FaGoogle className='size-5' /> },
	{ id: 'github', label: 'GitHub', icon: <FaGithub className='size-5' /> }
]

const codeMessages: Record<
	string,
	{ type: 'success' | 'error'; text: string }
> = {
	success: { type: 'success', text: 'Сервис успешно привязан' },
	already_linked: {
		type: 'error',
		text: 'Этот сервис уже привязан к другому аккаунту'
	},
	link_failed: {
		type: 'error',
		text: 'Не удалось привязать сервис. Попробуйте ещё раз'
	}
}

export function OauthServices() {
	const router = useRouter()
	const { user, isLoadingUser } = useProfile()
	const searchParams = useSearchParams()
	const { oauthLink, isLoadingOauthLink } = useOauthLinkMutation('oauth link')
	const { unlink, isLoadingUnlink } = useUnlinkMutation()

	useEffect(() => {
		const code = searchParams.get('code')
		if (!code) return

		const message = codeMessages[code]
		if (message) {
			if (message.type === 'success') {
				toast.success(message.text)
			} else {
				toast.error(message.text)
			}
		}

		router.replace(window.location.pathname)
	}, [searchParams, router])

	if (!user) {
		return null
	}

	const linkedProviders =
		user.data.account?.map(a => a.provider.toLowerCase()) ?? []

	return (
		<Card className='w-full max-w-145'>
			<CardHeader className='flex flex-row items-center justify-between'>
				<CardTitle className='text-2xl'>Привязанные сервисы</CardTitle>
				{isLoadingUser ? (
					<UserButtonLoading />
				) : (
					<UserButton user={user.data} />
				)}
			</CardHeader>
			<CardContent>
				{isLoadingUser ? (
					<Loading />
				) : (
					<div className='flex flex-col gap-3'>
						{PROVIDERS.map(({ id, label, icon }) => {
							const isLinked = linkedProviders.includes(id)
							return (
								<div
									key={id}
									className='flex items-center justify-between'
								>
									<div className='flex items-center gap-3'>
										{icon}
										<span className='text-lg'>{label}</span>
									</div>
									{isLinked ? (
										<Button
											type='button'
											variant='outline'
											disabled={isLoadingUnlink}
											onClick={() => unlink(id)}
										>
											Отвязать
										</Button>
									) : (
										<Button
											type='button'
											variant='outline'
											disabled={isLoadingOauthLink}
											onClick={() => oauthLink(id)}
										>
											Привязать
										</Button>
									)}
								</div>
							)
						})}
					</div>
				)}
			</CardContent>
		</Card>
	)
}
