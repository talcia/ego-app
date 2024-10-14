import Button from '@/components/button/button';
import Error from '@/components/error/error';
import Input from '@/components/input/input';
import Logo from '@/components/logo/logo';
import { useUserSession } from '@/hooks/useUserSession';
import AdminContext from '@/store/player-context';
import RoundContext from '@/store/round-context';
import { db } from '@/utils/db/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

interface CreateRoomProps {
	questionsLength: number;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ questionsLength }) => {
	const router = useRouter();
	const { numberOfRounds, setNumberOfRounds, maxRounds, setMaxRounds } =
		useContext(RoundContext);
	const [initialPoints, setInitialPoints] = useState(10);
	const [roomCode, setRoomCode] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const { setIsAdmin } = useContext(AdminContext);
	const [isLoading, setIsLoading] = useState(false);
	const { id, name, email } = useUserSession();

	useEffect(() => {
		setMaxRounds(questionsLength);
	}, [questionsLength, setMaxRounds]);

	const handleCreateRoom = async () => {
		setIsLoading(true);
		const response = await fetch('/api/room', {
			method: 'POST',
			body: JSON.stringify({
				roomCode,
				user: {
					name: name || email,
					admin: true,
					id: id,
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
		setIsLoading(false);
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
			<Button onClick={handleCreateRoom} isLoading={isLoading}>
				Create room
			</Button>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const questionRef = collection(db, 'questions');
	const questions = await getDocs(questionRef);

	return {
		props: {
			questionsLength: questions.docs.length,
		},
	};
};

export default CreateRoom;
