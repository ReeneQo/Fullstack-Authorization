import { FaGithub, FaGoogle } from 'react-icons/fa'

import { Button } from '@/shared/components/ui'

import { useOauthMutation } from '../hooks'

export const AuthSocial = () => {
	const { oauth, isLoadingOauth } = useOauthMutation('GOOGLE_OAUTH')

	return (
		<>
			<div className='grid grid-cols-2 gap-6'>
				<Button
					type='button'
					variant='outline'
					onClick={() => {
						oauth('google')
					}}
					disabled={isLoadingOauth}
				>
					<FaGoogle className='mr-2 size-4' />
					Google
				</Button>
				<Button
					type='button'
					variant='outline'
					onClick={() => {
						oauth('github')
					}}
					disabled={isLoadingOauth}
				>
					<FaGithub />
					Github
				</Button>
			</div>
			<div className='relative my-4'>
				<div className='my-4 flex items-center gap-2'>
					<span className='bg-border h-px w-full' />
					<span className='text-muted-foreground px-2 text-xs uppercase'>
						Или
					</span>
					<span className='bg-border h-px w-full' />
				</div>
			</div>
		</>
	)
}
