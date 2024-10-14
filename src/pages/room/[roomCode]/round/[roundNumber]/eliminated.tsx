import PlayerAvatar from '@/components/player-avatar/player-avatar';
import { EliminatedPlayer } from '@/types/round-types';
import { getPlayerData, getPlayers } from '@/utils/api/players';
import { canUserAccessRoom, getRoomData } from '@/utils/api/rooms';
import { getRoundData } from '@/utils/api/rounds';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface PlayerEliminatedPageProps {
	isEndGame: boolean;
	eliminatedPlayers: EliminatedPlayer[];
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
			<p className="py-2">
				{eliminatedPlayers[index].name} was eliminated
			</p>
		</div>
	);
};

export default PlayerEliminatedPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { roundNumber, roomCode } = context.params!;

	const roomData = await getRoomData(roomCode as string);

	const roundData = await getRoundData(
		roomCode as string,
		roundNumber as string
	);

	const canAccess = await canUserAccessRoom(roomCode as string, context.req);

	if (!canAccess || !roomData || !roundData) {
		return { notFound: true };
	}

	const eliminatedPlayers = roundData?.eliminatedPlayers;
	const eliminatedPlayersArray: { id: string; name: string }[] = [];
	for (let player of eliminatedPlayers) {
		const { id, name } =
			(await getPlayerData(roomCode as string, player)) || {};
		eliminatedPlayersArray.push({ id, name });
	}

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
