import Button from '@/components/button/button';
import PlayersList from '@/components/players-list/players-list';
import { db } from '@/utils/db/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const WaitingList: React.FC = () => {
	const router = useRouter();
	const {
		query: { roomCode },
	} = router;
	const [waitingList, setWaitingList] = useState<any[]>([]);

	useEffect(() => {
		if (!roomCode || Array.isArray(roomCode)) {
			return;
		}
		const playersCollection = collection(db, 'rooms', roomCode, 'players');

		const unsubscribe = onSnapshot(playersCollection, (docSnap) => {
			const players = docSnap.docs.map((doc: any) => ({
				id: doc.id,
				...doc.data(),
			}));

			const waitingPlayers = players.filter(
				(player: any) => player.status === 'pending'
			);

			setWaitingList(waitingPlayers);
		});

		return () => unsubscribe();
	}, [roomCode]);

	const onBackClick = () => {
		router.back();
	};

	const onAcceptClick = (userId: string) => {
		fetch(`/api/room/${router.query.roomCode}/player/${userId}`, {
			method: 'POST',
		});
	};

	const onDeclineClick = (userId: string) => {
		fetch(`/api/room/${router.query.roomCode}/player/${userId}`, {
			method: 'DELETE',
		});
	};

	return (
		<div className="flex flex-col">
			<h1 className="text-customWhite text-center text-2xl mb-5">
				{router.query.roomCode}
			</h1>

			<p className="text-customWhite  text-xl mb-5">Waiting List</p>

			<div>
				{waitingList.length > 0 ? (
					<>
						<p className="text-customWhite  text-xl mb-5">
							Players
						</p>
						<PlayersList
							players={waitingList}
							isWaitingList={true}
							onAcceptClick={onAcceptClick}
							onDeclineClick={onDeclineClick}
						/>
					</>
				) : (
					<p className="text-customWhite  text-sm mb-5">
						no users waiting to be added
					</p>
				)}
			</div>

			<Button onClick={onBackClick}>Back</Button>
		</div>
	);
};

export default WaitingList;
