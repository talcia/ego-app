import Button from '@/components/button/button';
import Input from '@/components/input/input';
import Error from '@/components/error/error';
import Logo from '@/components/logo/logo';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/utils/db/firebase';
import PlayerContext from '@/store/player-context';

const JoinRoom: React.FC = () => {
	const [roomCode, setRoomCode] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const router = useRouter();
	const [user] = useAuthState(auth);
	const { setIsAdmin } = useContext(PlayerContext);

	const handleClick = async () => {
		const response = await fetch(`/api/room/${roomCode}/join`, {
			method: 'POST',
			body: JSON.stringify({
				user: {
					name: user?.displayName || user?.email,
					avatar: user?.photoURL,
					id: user?.uid,
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
			}
			router.push(`/room/${roomCode}/wait`);
		} else if (response.status === 400) {
			const responseMessage = await response.json();
			setErrorMessage(responseMessage.message);
		}
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
				<Button onClick={handleClick}>Join</Button>
			</div>
		</>
	);
};

export default JoinRoom;
