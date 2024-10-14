import Logo from '@/components/logo/logo';
import QuestionPage, {
	QuestionPageProps,
} from '@/components/question-page/question-page';
import { useUserSession } from '@/hooks/useUserSession';
import PlayerContext from '@/store/player-context';
import { PlayerAnswer } from '@/types/round-types';
import { getRoundData, pushPlayerAnswer } from '@/utils/api/rounds';
import { db } from '@/utils/db/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

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
	const { id } = useUserSession();

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
					id: id,
				},
			});
		}
	}, [isEliminated, questionAboutPlayer.id, roomCode, roundNumber, id]);

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
				(player: PlayerAnswer) =>
					player.isReady ||
					(player.isEliminated &&
						roundData?.questionAboutPlayer.id !== player.id)
			);

			if (isEveryPlayerReady) {
				router.replace(
					`/room/${roomCode}/round/${roundNumber}/round-summarize`
				);
			}
		});

		return () => unsubscribe();
	}, [isEliminated, roomCode, roundNumber, router, id]);

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

	const roundData = await getRoundData(
		roomCode as string,
		roundNumber as string
	);

	if (!roundData) {
		return { notFound: true };
	}

	const { question, answers, questionAboutPlayer, playersAnswers } =
		roundData;

	return {
		props: {
			question,
			answers,
			questionAboutPlayer,
			playersAnswers,
		},
	};
};
