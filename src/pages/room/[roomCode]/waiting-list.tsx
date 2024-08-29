import Button from '@/components/button/button';
import PlayersList from '@/components/players-list/players-list';
import { db } from '@/utils/db/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const WaitingList: React.FC = () => {
	const router = useRouter();
	const {
		query: { roomCode },
	} = router;
	const [waitingList, setWaitingList] = useState([]);

	useEffect(() => {
		if (!roomCode || Array.isArray(roomCode)) {
			return;
		}
		const roomDocRef = doc(db, 'rooms', roomCode);

		const unsubscribe = onSnapshot(roomDocRef, (docSnap) => {
			if (docSnap.exists()) {
				const { players } = docSnap.data();
				const waitingPlayers = players.filter(
					(player: any) => player.status === 'pending'
				);
				setWaitingList(waitingPlayers);
			} else {
				console.log('Room does not exist!');
			}
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
			<h1 className="white-text text-center text-2xl mb-5">
				{router.query.roomCode}
			</h1>

			<p className="white-text  text-xl mb-5">Waiting List</p>

			<div>
				{waitingList.length > 0 ? (
					<>
						<p className="white-text  text-xl mb-5">Players</p>
						<PlayersList
							players={waitingList}
							isWaitingList={true}
							onAcceptClick={onAcceptClick}
							onDeclineClick={onDeclineClick}
						/>
					</>
				) : (
					<p className="white-text  text-sm mb-5">
						no users waiting to be added
					</p>
				)}
			</div>

			<Button onClick={onBackClick}>Back</Button>
		</div>
	);
};

export default WaitingList;
