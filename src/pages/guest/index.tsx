import { useState } from 'react';
import Button from '@/components/button/button';
import Error from '@/components/error/error';
import Input from '@/components/input/input';
import Logo from '@/components/logo/logo';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const GuestPage = () => {
	const [roomCode, setRoomCode] = useState('');
	const [userName, setUserName] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const session = useSession();

	const handleClick = async () => {
		setIsLoading(true);
		const response = await fetch(`/api/room/${roomCode}/join`, {
			method: 'POST',
			body: JSON.stringify({
				user: {
					name: userName,
					id: session?.data?.user.id,
					isReady: false,
					status: 'pending',
				},
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (response.status === 201) {
			router.push(`/room/${roomCode}/wait`);
		} else if (response.status === 400) {
			const responseMessage = await response.json();
			setErrorMessage(responseMessage.message);
		}
		setIsLoading(false);
	};

	return (
		<>
			<Logo />
			<div>
				{errorMessage && <Error errorMessage={errorMessage} />}
				<Input
					label="Name"
					value={userName}
					onChange={(event) => setUserName(event.target.value)}
				/>
				<Input
					label="Room Code"
					value={roomCode}
					onChange={(event) => setRoomCode(event.target.value)}
				/>
				<Button onClick={handleClick} isLoading={isLoading}>
					Next
				</Button>
			</div>
		</>
	);
};

export default GuestPage;
