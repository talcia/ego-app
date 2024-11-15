import { useContext, useEffect, useState } from 'react';
import AnswersList from './answers-list';
import PlayerAvatar from '../player-avatar/player-avatar';
import Coin from './coin';
import Button from '../button/button';
import { pushPlayerAnswer } from '@/utils/api/rounds';
import router from 'next/router';
import PlayerContext from '@/store/player-context';
import { Answer, PlayerAnswer } from '@/types/round-types';
import { useUserSession } from '@/hooks/useUserSession';

export interface QuestionPageProps {
	question: string;
	answers: Answer[];
	questionAboutPlayer: {
		id: string;
		name: string;
		avatar: string;
	};
	playersAnswers: PlayerAnswer[];
}

const QuestionPage: React.FC<QuestionPageProps> = ({
	question,
	answers,
	questionAboutPlayer,
	playersAnswers,
}) => {
	const [selectedCoins, setSelectedCoins] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState('');
	const { points, isEliminated } = useContext(PlayerContext);
	const [isReady, setIsReady] = useState(false);
	const { id } = useUserSession();

	const {
		query: { roundNumber, roomCode },
	} = router;

	useEffect(() => {
		pushPlayerAnswer({
			roomCode: roomCode as string,
			roundNumber: roundNumber as string,
			playerData: {
				isReadyForNextRound: true,
			},
		});
	}, [roomCode, roundNumber]);

	const onClickReady = () => {
		setIsReady((prev) => !prev);
		pushPlayerAnswer({
			roomCode: roomCode as string,
			roundNumber: roundNumber as string,
			playerData: {
				isEliminated,
				isReady: !isReady,
				id: id,
				isReadyForNextRound: false,
				answer: selectedAnswer,
				...(!isEliminated && {
					coin: selectedCoins,
				}),
			},
			userId: questionAboutPlayer.id,
		});
	};

	return (
		<div>
			{/* <div>
				<PlayersAvatarList players={playersAnswers} user={user}/>
			</div> */}
			<div>
				<p className="text-customWhite mb-4 text-center">
					Question about
				</p>
				<PlayerAvatar
					name={questionAboutPlayer.name}
					playerId={questionAboutPlayer.id}
					size={150}
					className="flex-col items-center"
				/>
			</div>
			<div className="py-5">
				<p className="text-customWhite my-3 text-center">{question}</p>
				<AnswersList
					answers={answers}
					selectedAnswer={selectedAnswer}
					setSelectedAnswer={setSelectedAnswer}
				/>
			</div>
			{questionAboutPlayer.id !== id && !isEliminated && (
				<div className="mt-3">
					<div className="flex justify-around">
						<Coin
							onCoinClick={setSelectedCoins}
							playerCoin={points}
						/>
						<Coin
							onCoinClick={setSelectedCoins}
							playerCoin={points}
						/>
					</div>
					<p className="text-customWhite text-center mt-3">
						You have {points} coins
					</p>
				</div>
			)}
			{(!isEliminated || questionAboutPlayer.id === id) && (
				<Button
					disabled={
						!(questionAboutPlayer.id === id && selectedAnswer) &&
						(!selectedAnswer || !selectedCoins)
					}
					onClick={onClickReady}
				>
					{isReady ? 'Change anwser' : 'Ready'}
				</Button>
			)}
		</div>
	);
};

export default QuestionPage;
