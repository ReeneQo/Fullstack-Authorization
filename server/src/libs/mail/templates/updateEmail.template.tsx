import {Html} from '@react-email/html'
import * as React from 'react'
import {Body, Heading, Link, Tailwind, Text} from '@react-email/components'

interface ResetPasswordTemplateProps {
	token: string;
}

export const UpdateEmailTemplate = ({
	token
}: ResetPasswordTemplateProps) => {

	return (
			<Tailwind>
				<Html>
				<Body className='text-black'>
					<Heading>Подтверждение новой почты</Heading>
					<Text>
							Здравствуйте, ваш код для подтверждения почты: <strong>{token}</strong> 
					</Text>
					<Text>
							Пожалуйста, введите этот код в приложении для подтверждения обновления почты.
					</Text>
					<Text>
							Если вы не запрашивали этот код, просто проигнорируйте это сообщение.
					</Text>
				</Body>
			</Html>
			</Tailwind>
		)
};
