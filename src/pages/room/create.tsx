import Button from '@/components/button/button';
import Error from '@/components/error/error';
import Input from '@/components/input/input';
import AdminContext from '@/store/admin-context';
import { auth, db } from '@/utils/db/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const CreateRoom: React.FC = () => {
	const router = useRouter();
	const [roomCode, setRoomCode] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [numberOfQuestions, setNumberOfQuestion] = useState(3);
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
					points: 10,
					admin: true,
					id: user?.uid,
					isReady: true,
					status: 'accepted',
				},
				numberOfRounds: numberOfQuestions,
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
				label="How many rounds?"
				type="number"
				value={numberOfQuestions}
				max={maxRounds}
				onChange={({ target: { value } }) =>
					setNumberOfQuestion(+value)
				}
			/>

			<Button onClick={handleCreateRoom}>Create room</Button>
		</div>
	);
};

export default CreateRoom;
