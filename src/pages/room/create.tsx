import Button from '@/components/button/button';
import Error from '@/components/error/error';
import Input from '@/components/input/input';
import AdminContext from '@/store/admin-context';
import { auth } from '@/utils/db/firebase';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const CreateRoom: React.FC = () => {
	const router = useRouter();
	const [roomCode, setRoomCode] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [maxNumberOfPlayers, setMaxNumberOfPlayers] = useState(4);
	const [user] = useAuthState(auth);
	const { setIsAdmin } = useContext(AdminContext);

	const handleCreateRoom = async () => {
		const response = await fetch('/api/room', {
			method: 'POST',
			body: JSON.stringify({
				roomCode,
				user: {
					name: user?.displayName || user?.email,
					avatar: user?.photoURL,
					points: 10,
					admin: true,
					id: user?.uid,
					isReady: true,
					status: 'accepted',
				},
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (response.status === 201) {
			setIsAdmin(true);
			router.push(`/room/${roomCode}/lobby`);
		} else if (response.status === 400) {
			const responseMessage = await response.json();
			setErrorMessage(responseMessage.message);
		}
	};

	return (
		<div className="flex flex-col">
			<h1 className="white-text text-center text-2xl mb-5">
				Creating Room
			</h1>
			{errorMessage && <Error errorMessage={errorMessage} />}
			<Input
				label="Room code"
				value={roomCode}
				onChange={({ target: { value } }) => setRoomCode(value)}
			/>
			<Input
				label="Max number of players"
				type="number"
				value={maxNumberOfPlayers}
				onChange={({ target: { value } }) =>
					setMaxNumberOfPlayers(+value)
				}
			/>

			<Button onClick={handleCreateRoom}>Create room</Button>
		</div>
	);
};

export default CreateRoom;
