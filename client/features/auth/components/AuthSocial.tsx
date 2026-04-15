import { FaGithub, FaGoogle } from 'react-icons/fa'

import { Button } from '@/shared/components/ui'

import { useOauthMutation } from '../hooks/useOauthRegisterMutation'

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
				<div className='absolute inset-0 flex items-center'>
					<span className='w-full border-t' />
				</div>
				<div className='relative flex justify-center text-xs uppercase'>
					<span className='bg-background text-muted-foreground px-2'>
						Или
					</span>
				</div>
			</div>
		</>
	)
}
