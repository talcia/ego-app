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
			{eliminatedPlayers[index].name} was eliminated
		</div>
	);
};

export default PlayerEliminatedPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { roundNumber, roomCode } = context.params!;
	const roundCollection = doc(
		db,
		'rooms',
		roomCode as string,
		'rounds',
		roundNumber as string
	);

	const roundRef = await getDoc(roundCollection);
	const roundData = roundRef.data();

	const eliminatedPlayers = roundData?.eliminatedPlayers;
	const eliminatedPlayersArray: any[] = [];
	for (let player of eliminatedPlayers) {
		const playerCollection = doc(
			db,
			'rooms',
			roomCode as string,
			'players',
			player
		);
		const playerRef = await getDoc(playerCollection);
		const { id, name, avatar } = playerRef.data() || {};
		eliminatedPlayersArray.push({ id, name, avatar });
	}

	const roomCollection = doc(db, 'rooms', roomCode as string);
	const room = await getDoc(roomCollection);
	const roomData = room.data();

	const playersCollection = collection(
		db,
		'rooms',
		roomCode as string,
		'players'
	);
	const playersData = await getDocs(playersCollection);
	const players = playersData.docs;

	const isLastRound = roomData?.numberOfRounds === Number(roundNumber);
	const isEndGame = roomData?.eliminatedPlayers.length === players.length - 1;

	return {
		props: {
			eliminatedPlayers: eliminatedPlayersArray,
			isEndGame: isEndGame || isLastRound,
		},
	};
};
