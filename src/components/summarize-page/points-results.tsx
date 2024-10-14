import PlayerContext from '@/store/player-context';
import { User } from '@/types/user-types';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

interface PointsResultProps {
	correctAnswer: string;
	userAnswer: { coin: number; answer: string };
	user: User;
}

const PointsResult: React.FC<PointsResultProps> = ({
	correctAnswer,
	userAnswer: { coin, answer },
	user,
}) => {
	const { points, setPoints, setIsEliminated, isEliminated } =
		useContext(PlayerContext);
	const [isEliminatedFromPrevRound, _] = useState(isEliminated);
	const {
		query: { roomCode, roundNumber },
	} = useRouter();
	const isUserAnswerCorrect = correctAnswer === answer;

	useEffect(() => {
		if (isUserAnswerCorrect) {
			setPoints(points + coin);
		} else {
			setPoints(points - coin);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [coin, isUserAnswerCorrect]);

	useEffect(() => {
		if (points === 0 && !isEliminated) {
			setIsEliminated(true);
			fetch(`/api/room/${roomCode}/round/${roundNumber}/eliminate`, {
				method: 'POST',
				body: JSON.stringify({ userId: user.id }),
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [points, roomCode, roundNumber, setIsEliminated, user.id]);

	return (
		<>
			{!isEliminatedFromPrevRound && (
				<div>
					{isUserAnswerCorrect && (
						<p className="text-customWhite">
							Correct Answer, you get {coin} coin{coin > 1 && 's'}
						</p>
					)}
					{!isUserAnswerCorrect && (
						<p className="text-customWhite">
							not Correct Answer, you loose {coin} coin
							{coin > 1 && 's'}
						</p>
					)}
				</div>
			)}
		</>
	);
};

export default PointsResult;
