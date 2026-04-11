import { AuthWrapper } from './AuthWrapper'
import { routes } from '@/core/configs/routes'

export const LoginForm = () => {
	return (
		<AuthWrapper
			heading='Логин'
			description='Чтобы войти на сайт введите ваш email и пароль'
			backButtonLabel='Нету аккаунта? Заругистрируйтесь'
			backButtonHref={routes.auth.register}
			isShowSocial
		>
			Логин
		</AuthWrapper>
	)
}
