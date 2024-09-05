import Button from '@/components/button/button';
import PlayersResults from '@/components/players-list/players-results';
import { db } from '@/utils/db/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const FinishPage: React.FC = () => {
	const router = useRouter();
	const {
		query: { roomCode },
	} = router;
	const [players, setPlayers] = useState<any[]>([]);

	useEffect(() => {
		if (!roomCode || Array.isArray(roomCode)) {
			return;
		}
		const getPlayers = async () => {
			const playersCollection = collection(
				db,
				'rooms',
				roomCode,
				'players'
			);
			const playersDocs = await getDocs(playersCollection);

			const players = playersDocs.docs.map((doc: any) => ({
				id: doc.id,
				...doc.data(),
			}));

			setPlayers(players);
		};

		getPlayers();
	}, [roomCode, router]);

	const onBackToLobbyClick = async () => {
		const response = await fetch(`/api/room/${roomCode}/lobby`, {
			method: 'POST',
		});
		if (response.status === 200) {
			router.replace(`/room/${roomCode}/lobby`);
		}
	};

	return (
		<div className="flex flex-col">
			<h1 className="white-text text-center text-2xl mb-5">Results</h1>
			<div>
				<PlayersResults players={players} />
			</div>

			<Button onClick={onBackToLobbyClick}>Back to Lobby</Button>
		</div>
	);
};

export default FinishPage;
