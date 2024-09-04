import Button from '@/components/button/button';
import PlayerAvatar from '@/components/question-page/player-avatar';
import AnswerWithBadgeList from '@/components/summarize-page/answer-with-badge-list';
import PointsResult from '@/components/summarize-page/points-results';
import { auth, db } from '@/utils/db/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const RoundSummarizePage = () => {
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
		const isEveryPlayerReady = roundData?.playersAnswers.every(
			(player: any) => player.isReadyForNextRound
		);
		if (isEveryPlayerReady) {
			router.push(`/room/${roomCode}/round/${Number(roundNumber) + 1}`);
		}
	}, [roomCode, roundData, roundNumber, router]);

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
				<p className="white-text mb-4 text-center">Correct answer is</p>
				<PlayerAvatar
					name={roundData?.questionAboutPlayer.name}
					photoUrl={roundData?.questionAboutPlayer.avatar}
				/>
			</div>
			<div className="py-5">
				<p className="white-text my-3">{roundData?.question}</p>
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
				<Button
					onClick={handleOnReadyClick}
					variant={isUserReady ? 'white' : 'red'}
				>
					{isUserReady ? 'Not ready' : 'Next'}
				</Button>
			</div>
		</>
	);
};

export default RoundSummarizePage;
