import { useEffect, useState } from 'react';
import AnswersList, { Answer } from './answers-list';
import PlayerAvatar from './player-avatar';
import Coin from './coin';
import Button from '../button/button';
import { auth } from '@/utils/db/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import PlayersAvatarList from '../players-list/players-list-avatars';
import { pushPlayerAnswer } from '@/utils/api/rounds';
import router from 'next/router';
import { getPlayerData } from '@/utils/api/players';

interface QuestionPageProps {
	question: string;
	answers: Answer[];
	questionAboutPlayer: {
		id: string;
		name: string;
		avatar: string;
	};
	players: { id: string; avatar: string; isReady: boolean }[];
}

const QuestionPage: React.FC<QuestionPageProps> = ({
	question,
	answers,
	questionAboutPlayer,
	players,
}) => {
	const [selectedCoins, setSelectedCoins] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState('');
	const [playerPoints, setPlayerPoints] = useState(0);
	const [isReady, setIsReady] = useState(false);

	const {
		query: { roundNumber, roomCode },
	} = router;

	const [user] = useAuthState(auth);

	useEffect(() => {
		const getPlayerPoints = async () => {
			if (!user?.uid || !roomCode || Array.isArray(roomCode)) {
				return;
			}
			const player = await getPlayerData(roomCode, user.uid);
			setPlayerPoints(Number(player?.points));
		};
		getPlayerPoints();
	});

	const onClickReady = () => {
		setIsReady((prev) => !prev);
		pushPlayerAnswer({
			roomCode: roomCode as string,
			roundNumber: roundNumber as string,
			playerData: {
				answer: selectedAnswer,
				coin: selectedCoins,
				id: user?.uid,
				isReady,
				isReadyForNextRound: false,
			},
			userId: questionAboutPlayer.id,
		});
	};

	return (
		<div>
			<div>
				<PlayersAvatarList players={players} />
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
			{questionAboutPlayer.id !== user?.uid && (
				<div className="mt-3">
					<div className="flex justify-around">
						<Coin
							onCoinClick={setSelectedCoins}
							playerCoin={playerPoints}
						/>
						<Coin
							onCoinClick={setSelectedCoins}
							playerCoin={playerPoints}
						/>
					</div>
					<p className="white-text text-center mt-3">
						You have {playerPoints} coins
					</p>
				</div>
			)}
			<Button
				disabled={
					!(questionAboutPlayer.id === user?.uid && selectedAnswer) &&
					(!selectedAnswer || !selectedCoins)
				}
				onClick={onClickReady}
			>
				{isReady ? 'Change anwser' : 'Ready'}
			</Button>
		</div>
	);
};

export default QuestionPage;
