import {Html} from '@react-email/html'
import * as React from 'react'
import {Body, Heading, Link, Tailwind, Text} from '@react-email/components'

interface ChangeEmailNotificationTemplateProps {
	email: string
}

export const ChangeEmailNotificationTemplate = ({
	email
}: ChangeEmailNotificationTemplateProps) => {

	return (
			<Tailwind>
				<Html>
				<Body className='text-black'>
					<Heading>Ваша почта изменена</Heading>
					<Text>
							Здравствуйте, ваша почта была изменена на : <strong>{email}</strong> 
					</Text>
					<Text>
							Если это были не вы, то свяжитесь с поддержкой.
					</Text>
					<Text>
							Если это были вы, то просто проигнорируйте это сообщение.
					</Text>
				</Body>
			</Html>
			</Tailwind>
		)
};
