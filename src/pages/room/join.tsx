import Button from '@/components/button/button';
import Input from '@/components/input/input';
import Error from '@/components/error/error';
import Logo from '@/components/logo/logo';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import PlayerContext from '@/store/player-context';
import { GetServerSideProps } from 'next';
import { getSessionUser } from '@/utils/auth/server-auth';
import { User } from '@/types/user-types';

interface JoinRoomProps {
	user: User;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ user }) => {
	const [roomCode, setRoomCode] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const router = useRouter();
	const { setIsAdmin } = useContext(PlayerContext);
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = async () => {
		setIsLoading(true);
		const response = await fetch(`/api/room/${roomCode}/join`, {
			method: 'POST',
			body: JSON.stringify({
				user: {
					name: user.name || user.email,
					id: user.id,
					isReady: false,
					status: 'pending',
				},
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (response.status === 201) {
			const data = await response.json();
			if (data.isAdmin) {
				setIsAdmin(true);
				router.push(`/room/${roomCode}/lobby`);
			} else {
				router.push(`/room/${roomCode}/wait`);
			}
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
				<h1 className="text-customWhite text-center text-2xl mb-5">
					Joining Room
				</h1>
				{errorMessage && <Error errorMessage={errorMessage} />}
				<Input
					label="Room Code"
					value={roomCode}
					onChange={(event) => setRoomCode(event.target.value)}
				/>
				<Button onClick={handleClick} isLoading={isLoading}>
					Join
				</Button>
			</div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	return getSessionUser(context);
};

export default JoinRoom;
