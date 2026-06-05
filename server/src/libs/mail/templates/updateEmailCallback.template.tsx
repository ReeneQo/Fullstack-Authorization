import {Html} from '@react-email/html'
import * as React from 'react'
import {Body, Heading, Link, Tailwind, Text} from '@react-email/components'

interface UpdateEmailCallbackTemplateProps {
	domain: string
	token: string;
}

export const UpdateEmailCallbackTemplate = ({
	domain,
	token,
}: UpdateEmailCallbackTemplateProps) => {
	const changeEmailCallback = `${domain}/dashboard/update/email/confirm?token=${token}`;

	return (
			<Tailwind>
				<Html>
				<Body className='text-black'>
					<Heading>Запрос на изменение почты</Heading>
					<Text>
							Здравствуйте, запрос на изменение почты. 
					</Text>
					<Text>
							Если вы это не делали, убедитесь в безопасности аккаунта и смените пароль.
					</Text>
					<Link href={changeEmailCallback}>Перейдите по ссылке для изменения почты</Link>
				</Body>
			</Html>
			</Tailwind>
		)
};
