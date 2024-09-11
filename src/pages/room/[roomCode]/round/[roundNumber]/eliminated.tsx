import PlayerAvatar from '@/components/question-page/player-avatar';
import { getPlayerData, getPlayers } from '@/utils/api/players';
import { getRoomData } from '@/utils/api/rooms';
import { getRoundData } from '@/utils/api/rounds';
import { db } from '@/utils/db/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface PlayerEliminatedPageProps {
	isEndGame: boolean;
	eliminatedPlayers: {
		id: string;
		name: string;
		avatar: string;
	}[];
}

const PlayerEliminatedPage: React.FC<PlayerEliminatedPageProps> = ({
	isEndGame,
	eliminatedPlayers,
}) => {
	const router = useRouter();
	const [index, setIndex] = useState(0);
	const {
		query: { roomCode, roundNumber },
	} = router;

	useEffect(() => {
		const timer = setInterval(() => {
			if (eliminatedPlayers[index + 1]) {
				setIndex((prev) => prev + 1);
				return;
			}
			if (isEndGame) {
				router.push(`/room/${roomCode}/round/finish`);
			} else {
				router.push(
					`/room/${roomCode}/round/${Number(roundNumber) + 1}`
				);
			}
		}, 4000);
		return () => clearInterval(timer);
	}, [eliminatedPlayers, index, isEndGame, roomCode, roundNumber, router]);

	if (eliminatedPlayers.length === 0) {
		return;
	}

	return (
		<div className="text-customWhite">
			<PlayerAvatar playerId={eliminatedPlayers[index].id} />
			{eliminatedPlayers[index].name} was eliminated
		</div>
	);
};

export default PlayerEliminatedPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { roundNumber, roomCode } = context.params!;

	const roundData = await getRoundData(
		roomCode as string,
		roundNumber as string
	);

	const eliminatedPlayers = roundData?.eliminatedPlayers;
	const eliminatedPlayersArray: any[] = [];
	for (let player of eliminatedPlayers) {
		const { id, name, avatar } =
			(await getPlayerData(roomCode as string, player)) || {};
		eliminatedPlayersArray.push({ id, name, avatar });
	}

	const roomData = await getRoomData(roomCode as string);

	const players = await getPlayers(roomCode as string);

	const isLastRound = roomData?.numberOfRounds === Number(roundNumber);
	const isEndGame = roomData?.eliminatedPlayers.length === players.length - 1;

	return {
		props: {
			eliminatedPlayers: eliminatedPlayersArray,
			isEndGame: isEndGame || isLastRound,
		},
	};
};
