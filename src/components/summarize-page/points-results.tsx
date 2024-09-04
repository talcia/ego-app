import { getPlayerData } from '@/utils/api/players';
import { auth } from '@/utils/db/firebase';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

interface PointsResultProps {
	correctAnswer: string;
	userAnswer: {
		answer: string;
		coin: number;
	};
}

const PointsResult: React.FC<PointsResultProps> = ({
	correctAnswer,
	userAnswer: { coin, answer },
}) => {
	const {
		query: { roomCode },
	} = useRouter();
	const [user] = useAuthState(auth);
	const [playerPoints, setPlayerPoints] = useState(0);
	const isUserAnswerCorrect = correctAnswer === answer;

	useEffect(() => {
		const getPlayerPoints = async () => {
			if (!user?.uid || !roomCode || Array.isArray(roomCode)) {
				return;
			}
			const playerData = await getPlayerData(roomCode, user.uid);
			setPlayerPoints(playerData?.points);
		};
		getPlayerPoints();
	}, [roomCode, user?.uid]);

	useEffect(() => {
		let pointsToUpdate = playerPoints;
		if (isUserAnswerCorrect) {
			pointsToUpdate += coin;
		} else {
			pointsToUpdate -= coin;
		}
		fetch(`/api/room/${roomCode}/player/${user?.uid}`, {
			method: 'PATCH',
			body: JSON.stringify({ key: 'points', value: pointsToUpdate }),
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}, [isUserAnswerCorrect, playerPoints, roomCode, user?.uid, coin]);

	return (
		<div>
			{isUserAnswerCorrect && (
				<p className="white-text">
					Correct Answer, you get {coin} coin{coin > 1 ?? 's'}
				</p>
			)}
			{!isUserAnswerCorrect && (
				<p className="white-text">
					not Correct Answer, you loose {coin} coin{coin > 1 ?? 's'}
				</p>
			)}
		</div>
	);
};

export default PointsResult;
