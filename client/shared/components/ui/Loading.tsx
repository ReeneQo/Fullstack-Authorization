import { LucideLoader2 } from 'lucide-react'

export const Loading = () => {
	return (
		<div className='flex items-center justify-center text-sm'>
			<LucideLoader2 className='mr-w size-5 animate-spin' />
			Загрузка...
		</div>
	)
}
