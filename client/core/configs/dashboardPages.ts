import { routes } from './routes'

export const pages = [
	{
		href: routes.dashboard.settings,
		label: 'Профиль'
	},
	{
		href: routes.dashboard.update.password,
		label: 'Изменить пароль'
	},
	{
		href: routes.dashboard.update.email,
		label: 'Изменить почту'
	}
]
