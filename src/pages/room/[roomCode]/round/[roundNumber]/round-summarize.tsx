import Button from '@/components/button/button';
import PlayerAvatar from '@/components/question-page/player-avatar';
import AnswerWithBadgeList from '@/components/summarize-page/answer-with-badge-list';
import PointsResult from '@/components/summarize-page/points-results';
import PlayerContext from '@/store/player-context';
import RoundContext from '@/store/round-context';
import { auth, db } from '@/utils/db/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const RoundSummarizePage = () => {
	const { numberOfRounds } = useContext(RoundContext);
	const { points } = useContext(PlayerContext);
	const router = useRouter();
	const {
		query: { roundNumber, roomCode },
	} = router;
	const [roundData, setRoundData] = useState<any>();
	const [userAnswer, setUserAnswer] = useState<{
		answer: string;
		coin: number;
	}>();
	const [isUserReady, setIsUserReady] = useState(false);
	const [user] = useAuthState(auth);

	useEffect(() => {
		if (!roomCode || Array.isArray(roomCode)) {
			return;
		}

		const roundCollection = doc(
			db,
			'rooms',
			roomCode,
			'rounds',
			roundNumber as string
		);

		const unsubscribe = onSnapshot(roundCollection, (docSnap) => {
			const roundData = docSnap.data();
			setRoundData(roundData);
		});

		return () => unsubscribe();
	}, [roomCode, roundNumber]);

	useEffect(() => {
		if (points === 0) {
			fetch(`/api/room/${roomCode}/player/${user?.uid}`, {
				method: 'PATCH',
				body: JSON.stringify({
					key: 'points',
					value: 0,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}
	});

	useEffect(() => {
		if (roundData) {
			const player = roundData?.playersAnswers.find(
				(player: any) => player.id === user?.uid
			);
			setUserAnswer({
				answer: player?.answer,
				coin: Number(player?.coin),
			});
		}
	}, [roundData, user?.uid]);

	useEffect(() => {
		const finishGame = async () => {
			const response = await fetch(
				`/api/room/${roomCode}/player/${user?.uid}`,
				{
					method: 'PATCH',
					body: JSON.stringify({ key: 'points', value: points }),
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (response.status === 201) {
				router.push(`/room/${roomCode}/round/finish`);
			}
		};

		const isEveryPlayerReady = roundData?.playersAnswers.every(
			(player: any) => player.isReadyForNextRound
		);

		if (!isEveryPlayerReady) {
			return;
		}
		if (roundData?.eliminatedPlayers.length > 0) {
			router.push(`/room/${roomCode}/round/${roundNumber}/eliminated`);
		} else if (Number(roundNumber) === numberOfRounds) {
			finishGame();
		} else {
			router.push(`/room/${roomCode}/round/${Number(roundNumber) + 1}`);
		}
	}, [
		numberOfRounds,
		points,
		roomCode,
		roundData,
		roundNumber,
		router,
		user?.uid,
	]);

	if (!roundData) {
		return;
	}

	const handleOnReadyClick = () => {
		fetch(`/api/room/${roomCode}/round/${roundNumber}`, {
			method: 'POST',
			body: JSON.stringify({
				playerData: {
					id: user?.uid,
					isReadyForNextRound: !isUserReady,
					...(points === 0 && { isEliminated: true }),
				},
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		setIsUserReady((prev) => !prev);
	};
	// add animation
	return (
		<>
			<div>
				<p className="text-customWhite mb-4 text-center">
					Correct answer is
				</p>
				<PlayerAvatar
					name={roundData?.questionAboutPlayer.name}
					playerId={roundData?.questionAboutPlayer.id}
					size={150}
				/>
			</div>
			<div className="py-5">
				<p className="text-customWhite my-3">{roundData?.question}</p>
				<AnswerWithBadgeList
					answers={roundData?.answers}
					correctAnswer={roundData?.correctAnswer}
					playersAnswers={roundData?.playersAnswers.filter(
						(player: any) =>
							player.id !== roundData?.questionAboutPlayer.id
					)}
				/>
			</div>
			{roundData?.questionAboutPlayer.id !== user?.uid && userAnswer && (
				<PointsResult
					correctAnswer={roundData.correctAnswer!}
					userAnswer={userAnswer}
				/>
			)}
			<div>
				{Number(roundNumber) === numberOfRounds ? (
					<Button
						onClick={handleOnReadyClick}
						variant={isUserReady ? 'customWhite' : 'customRed'}
					>
						{isUserReady ? 'Not ready' : 'See Results'}
					</Button>
				) : (
					<Button
						onClick={handleOnReadyClick}
						variant={isUserReady ? 'customWhite' : 'customRed'}
					>
						{isUserReady ? 'Not ready' : 'Next'}
					</Button>
				)}
			</div>
		</>
	);
};

export default RoundSummarizePage;
