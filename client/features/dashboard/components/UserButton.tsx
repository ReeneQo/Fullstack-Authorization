'use client'

import { useState } from 'react'
import { LuAperture, LuLogOut } from 'react-icons/lu'

import { IUser } from '@/features/auth/types'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Skeleton
} from '@/shared/components/ui'

import { useLogoutMutation } from '../hooks'

import { AvatarUploadDialog } from './AvatarUploadDialog'

export function UserButton({ user }: { user: IUser }) {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const { logout, isLoadingLogout } = useLogoutMutation()

	if (!user) {
		return null
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar>
						<AvatarImage
							alt={user.displayName}
							src={user.avatarKey ?? ''}
						></AvatarImage>
						<AvatarFallback>
							{user.displayName.slice(0, 1)}
						</AvatarFallback>
					</Avatar>
					<DropdownMenuContent className='w-40' align='end'>
						<DropdownMenuItem
							disabled={isLoadingLogout}
							onClick={() => logout()}
						>
							<LuLogOut className='mr-2 size-4' />
							Выйти
						</DropdownMenuItem>
						<DropdownMenuItem
							disabled={isLoadingLogout}
							onClick={() => setIsOpen(prev => !prev)}
						>
							<LuAperture className='mr-2 size-4' />
							Обновить аватар
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenuTrigger>
			</DropdownMenu>
			<AvatarUploadDialog isOpen={isOpen} setIsOpen={setIsOpen} />
		</>
	)
}

export const UserButtonLoading = () => {
	return <Skeleton className='h-10 w-10 rounded-full' />
}
