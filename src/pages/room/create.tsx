import Button from '@/components/button/button';
import Error from '@/components/error/error';
import Input from '@/components/input/input';
import Logo from '@/components/logo/logo';
import AdminContext from '@/store/player-context';
import RoundContext from '@/store/round-context';
import { auth, db } from '@/utils/db/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const CreateRoom: React.FC = () => {
	const router = useRouter();
	const { numberOfRounds, setNumberOfRounds } = useContext(RoundContext);
	const [initialPoints, setInitialPoints] = useState(10);
	const [roomCode, setRoomCode] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [maxRounds, setMaxRounds] = useState(0);
	const [user] = useAuthState(auth);
	const { setIsAdmin } = useContext(AdminContext);

	useEffect(() => {
		const getNumberOfQuestions = async () => {
			const questionRef = collection(db, 'questions');
			const questions = await getDocs(questionRef);
			setMaxRounds(questions.docs.length);
		};
		getNumberOfQuestions();
	}, []);

	const handleCreateRoom = async () => {
		const response = await fetch('/api/room', {
			method: 'POST',
			body: JSON.stringify({
				roomCode,
				user: {
					name: user?.displayName || user?.email,
					avatar: user?.photoURL,
					admin: true,
					id: user?.uid,
					isReady: true,
					status: 'accepted',
				},
				numberOfRounds,
				initialPoints,
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
		<div className="flex flex-col justify-center">
			<Logo />
			<h1 className="text-customWhite text-center text-2xl mb-5">
				Creating Room
			</h1>
			{errorMessage && <Error errorMessage={errorMessage} />}
			<Input
				label="Room code"
				value={roomCode}
				onChange={({ target: { value } }) => setRoomCode(value)}
			/>
			<Input
				label="How many rounds?"
				type="number"
				value={numberOfRounds}
				max={maxRounds}
				onChange={({ target: { value } }) => setNumberOfRounds(+value)}
			/>
			<Input
				label="Player initial points"
				type="number"
				value={initialPoints}
				max={10}
				onChange={({ target: { value } }) => setInitialPoints(+value)}
			/>
			<Button onClick={handleCreateRoom}>Create room</Button>
		</div>
	);
};

export default CreateRoom;
