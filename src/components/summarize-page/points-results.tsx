import PlayerContext from '@/store/player-context';
import { auth } from '@/utils/db/firebase';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
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
	const { points, setPoints, setIsEliminated } = useContext(PlayerContext);
	const {
		query: { roomCode, roundNumber },
	} = useRouter();
	const isUserAnswerCorrect = correctAnswer === answer;
	const [user] = useAuthState(auth);

	useEffect(() => {
		if (isUserAnswerCorrect) {
			setPoints(points + coin);
		} else {
			setPoints(points - coin);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [coin, isUserAnswerCorrect]);

	useEffect(() => {
		if (points === 0) {
			setIsEliminated(true);
			fetch(`/api/room/${roomCode}/round/${roundNumber}/eliminate`, {
				method: 'POST',
				body: JSON.stringify({ userId: user?.uid }),
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}
	}, [points, roomCode, roundNumber, setIsEliminated, user?.uid]);

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
