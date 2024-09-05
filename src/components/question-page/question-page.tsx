import { useContext, useEffect, useState } from 'react';
import AnswersList, { Answer } from './answers-list';
import PlayerAvatar from './player-avatar';
import Coin from './coin';
import Button from '../button/button';
import { auth } from '@/utils/db/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import PlayersAvatarList from '../players-list/players-list-avatars';
import { pushPlayerAnswer } from '@/utils/api/rounds';
import router from 'next/router';
import PlayerContext from '@/store/player-context';

export interface QuestionPageProps {
	question: string;
	answers: Answer[];
	questionAboutPlayer: {
		id: string;
		name: string;
		avatar: string;
	};
	playersAnswers: { id: string; avatar: string; isReady: boolean }[];
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

	const {
		query: { roundNumber, roomCode },
	} = router;

	const [user] = useAuthState(auth);

	useEffect(() => {
		pushPlayerAnswer({
			roomCode: roomCode as string,
			roundNumber: roundNumber as string,
			playerData: {
				isReadyForNextRound: true,
			},
		});
	}, [isEliminated, roomCode, roundNumber]);

	const onClickReady = () => {
		setIsReady((prev) => !prev);
		pushPlayerAnswer({
			roomCode: roomCode as string,
			roundNumber: roundNumber as string,
			playerData: {
				isEliminated,
				isReady,
				...(!isEliminated && {
					answer: selectedAnswer,
					coin: selectedCoins,
					id: user?.uid,
					isReadyForNextRound: false,
				}),
			},
			userId: questionAboutPlayer.id,
		});
	};

	return (
		<div>
			<div>
				<PlayersAvatarList players={playersAnswers} />
			</div>
			<div>
				<p className="white-text mb-4 text-center">Question about</p>
				<PlayerAvatar
					name={questionAboutPlayer.name}
					photoUrl={questionAboutPlayer.avatar}
				/>
			</div>
			<div className="py-5">
				<p className="white-text my-3">{question}</p>
				<AnswersList
					answers={answers}
					selectedAnswer={selectedAnswer}
					setSelectedAnswer={setSelectedAnswer}
				/>
			</div>
			{questionAboutPlayer.id !== user?.uid && !isEliminated && (
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
					<p className="white-text text-center mt-3">
						You have {points} coins
					</p>
				</div>
			)}
			{(!isEliminated || questionAboutPlayer.id === user?.uid) && (
				<Button
					disabled={
						!(
							questionAboutPlayer.id === user?.uid &&
							selectedAnswer
						) &&
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
