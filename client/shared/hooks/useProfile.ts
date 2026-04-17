import { useQuery } from '@tanstack/react-query'

import { userService } from '@/features/dashboard/services'

export const useProfile = () => {
	const { data: user, isLoading: isLoadingUser } = useQuery({
		queryKey: ['get profile'],
		queryFn: () => userService.getProfile()
	})

	return { user, isLoadingUser }
}
