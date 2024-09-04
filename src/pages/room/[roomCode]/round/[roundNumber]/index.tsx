import Logo from '@/components/logo/logo';
import QuestionPage from '@/components/question-page/question-page';
import { db } from '@/utils/db/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const RoundPage = () => {
	const router = useRouter();
	const [isRoundNumberShow, setIsRoundNumberShow] = useState(true);
	const {
		query: { roundNumber, roomCode },
	} = router;
	const [roundData, setRoundData] = useState<any>();

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsRoundNumberShow(false);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

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
		const isEveryPlayerReady = roundData?.playersAnswers.every(
			(player: any) => player.isReady
		);
		if (isEveryPlayerReady) {
			router.push(
				`/room/${roomCode}/round/${roundNumber}/round-summarize`
			);
		}
	}, [roomCode, roundData, roundNumber, router]);

	return (
		<>
			{isRoundNumberShow && (
				<>
					<Logo />
					<h1 className="white-text text-center text-4xl mb-5">
						Round {roundNumber}
					</h1>
				</>
			)}
			{!isRoundNumberShow && (
				<QuestionPage
					question={roundData.question}
					answers={roundData.answers}
					questionAboutPlayer={roundData.questionAboutPlayer}
					players={roundData.playersAnswers}
				/>
			)}
		</>
	);
};

export default RoundPage;
