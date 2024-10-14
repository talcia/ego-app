import Logo from '@/components/logo/logo';
import PlayersList from '@/components/players-list/players-list';
import { PlayerInLobby } from '@/types/room-types';
import { db } from '@/utils/db/firebase';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { collection, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const WaitingList: React.FC = () => {
	const router = useRouter();
	const {
		query: { roomCode },
	} = router;
	const [waitingList, setWaitingList] = useState<PlayerInLobby[]>([]);

	useEffect(() => {
		if (!roomCode || Array.isArray(roomCode)) {
			return;
		}
		const playersCollection = collection(db, 'rooms', roomCode, 'players');

		const unsubscribe = onSnapshot(playersCollection, (docSnap) => {
			const players = docSnap.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as PlayerInLobby[];

			const waitingPlayers = players.filter(
				(player) => player.status === 'pending'
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
		<div className="flex flex-col  min-w-[250px]">
			<div className="w-full flex gap-20 items-center justify-between  text-customWhite my-3">
				<FontAwesomeIcon
					icon={faArrowLeft}
					onClick={onBackClick}
					className="cursor-pointer"
				/>
				<Logo variant="small" />
			</div>
			<p className="text-customWhite text-center text-xl mb-5">
				Waiting List
			</p>

			<div>
				{waitingList.length > 0 ? (
					<>
						<PlayersList
							players={waitingList}
							isWaitingList={true}
							onAcceptClick={onAcceptClick}
							onDeclineClick={onDeclineClick}
						/>
					</>
				) : (
					<p className="text-customWhite  text-sm mb-5">
						No pending users to be added.
					</p>
				)}
			</div>
		</div>
	);
};

export default WaitingList;
