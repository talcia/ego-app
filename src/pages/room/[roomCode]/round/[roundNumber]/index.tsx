import Logo from '@/components/logo/logo';
import QuestionPage, {
	QuestionPageProps,
} from '@/components/question-page/question-page';
import PlayerContext from '@/store/player-context';
import { pushPlayerAnswer } from '@/utils/api/rounds';
import { auth, db } from '@/utils/db/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const RoundPage: React.FC<QuestionPageProps> = ({
	question,
	answers,
	questionAboutPlayer,
	playersAnswers,
}) => {
	const router = useRouter();
	const [isRoundNumberShow, setIsRoundNumberShow] = useState(true);
	const { roundNumber, roomCode } = router.query;
	const { isEliminated } = useContext(PlayerContext);
	const [user] = useAuthState(auth);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsRoundNumberShow(false);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (isEliminated) {
			pushPlayerAnswer({
				roomCode: roomCode as string,
				roundNumber: roundNumber as string,
				playerData: {
					isEliminated,
					id: user?.uid,
				},
			});
		}
	}, [
		isEliminated,
		questionAboutPlayer.id,
		roomCode,
		roundNumber,
		user?.uid,
	]);

	useEffect(() => {
		const roundCollection = doc(
			db,
			'rooms',
			roomCode as string,
			'rounds',
			roundNumber as string
		);

		const unsubscribe = onSnapshot(roundCollection, (docSnap) => {
			const roundData = docSnap.data();
			const players = roundData?.playersAnswers;
			const isEveryPlayerReady = players.every(
				(player: any) =>
					player.isReady ||
					(player.isEliminated &&
						roundData?.questionAboutPlayer.id !== player.id)
			);

			if (isEveryPlayerReady) {
				router.push(
					`/room/${roomCode}/round/${roundNumber}/round-summarize`
				);
			}
		});

		return () => unsubscribe();
	}, [isEliminated, roomCode, roundNumber, router, user?.uid]);

	return (
		<>
			{isRoundNumberShow && (
				<>
					<Logo />
					<h1 className="text-customWhite text-center text-4xl mb-5">
						Round {roundNumber}
					</h1>
				</>
			)}
			{!isRoundNumberShow && (
				<QuestionPage
					question={question}
					answers={answers}
					questionAboutPlayer={questionAboutPlayer}
					playersAnswers={playersAnswers}
				/>
			)}
		</>
	);
};

export default RoundPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { roundNumber, roomCode } = context.params!;

	const roundCollection = doc(
		db,
		'rooms',
		roomCode as string,
		'rounds',
		roundNumber as string
	);

	const roundDoc = await getDoc(roundCollection);
	const { question, answers, questionAboutPlayer, playersAnswers } =
		roundDoc.data() || {};

	return {
		props: {
			question,
			answers,
			questionAboutPlayer,
			playersAnswers,
		},
	};
};
