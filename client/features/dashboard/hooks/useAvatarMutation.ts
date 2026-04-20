'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils/toast-message-handler'

import { AvatarSchemaData } from '../schemas'
import { avatarService } from '../services'

export const useAvatarUploadMutation = () => {
	const queryClient = useQueryClient()
	const { mutate: avatarUpload, isPending: isLoadingAvatarUpload } =
		useMutation({
			mutationKey: ['avatar upload'],
			mutationFn: async (values: AvatarSchemaData) => {
				const formData = new FormData()
				formData.append('avatar', values.avatar)
				return avatarService.upload(formData)
			},
			onSuccess: () => {
				toast.success('Аватар успешно изменен')
				queryClient.invalidateQueries({ queryKey: ['get profile'] })
			},
			onError: error => {
				toastMessageHandler(error)
			}
		})

	return { avatarUpload, isLoadingAvatarUpload }
}

export const useAvatarDeleteMutation = () => {
	const queryClient = useQueryClient()

	const { mutate: avatarDelete, isPending: isLoadingAvatarDelete } =
		useMutation({
			mutationKey: ['avatar delete'],
			mutationFn: () => avatarService.delete(),
			onSuccess: () => {
				toast.success('Аватар успешно удален')
				queryClient.invalidateQueries({ queryKey: ['get profile'] })
			},
			onError: error => {
				toastMessageHandler(error)
			}
		})

	return { avatarDelete, isLoadingAvatarDelete }
}
