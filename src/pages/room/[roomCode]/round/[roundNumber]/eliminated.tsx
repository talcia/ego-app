import RoundContext from '@/store/round-context';
import { db } from '@/utils/db/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

const PlayerEliminatedPage = () => {
	const router = useRouter();
	const [eliminatedPlayers, setEliminatedPlayers] = useState<any[]>([]);
	const [index, setIndex] = useState(0);
	const { numberOfRounds } = useContext(RoundContext);
	const {
		query: { roomCode, roundNumber },
	} = router;

	// przeniesc do server sdie props
	useEffect(() => {
		if (!roomCode || Array.isArray(roomCode)) {
			return;
		}
		const getData = async () => {
			const roundCollection = doc(
				db,
				'rooms',
				roomCode,
				'rounds',
				roundNumber as string
			);

			const roundRef = await getDoc(roundCollection);
			const eliminatedPlayers = roundRef.data()?.eliminatedPlayers;

			const eliminatedPlayersData: any[] = [];
			for (let player of eliminatedPlayers) {
				const playerCollection = doc(
					db,
					'rooms',
					roomCode,
					'players',
					player as string
				);
				const playerRef = await getDoc(playerCollection);
				const { id, name, avatar } = playerRef.data() || {};
				eliminatedPlayersData.push({ id, name, avatar });
			}
			setEliminatedPlayers(eliminatedPlayersData);
		};

		getData();
	}, [roomCode, roundNumber]);

	console.log(index);

	useEffect(() => {
		const timer = setInterval(() => {
			console.log('timer');
			if (eliminatedPlayers[index + 1]) {
				setIndex((prev) => prev + 1);
				return;
			}
			if (Number(roundNumber) === numberOfRounds) {
				router.push(`/room/${roomCode}/round/finish`);
			} else {
				router.push(
					`/room/${roomCode}/round/${Number(roundNumber) + 1}`
				);
			}
		}, 4000);
		return () => clearInterval(timer);
	}, [
		eliminatedPlayers,
		index,
		numberOfRounds,
		roomCode,
		roundNumber,
		router,
	]);

	if (eliminatedPlayers.length === 0) {
		return;
	}

	return (
		<div className="white-text">
			{eliminatedPlayers[index].name} was eliminated
		</div>
	);
};

export default PlayerEliminatedPage;
