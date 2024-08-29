import Button from '@/components/button/button';
import PlayersList from '@/components/players-list/players-list';
import AdminContext from '@/store/admin-context';
import { auth, db } from '@/utils/db/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const RoomLobby: React.FC = () => {
	const {
		query: { roomCode },
	} = useRouter();
	const [players, setPlayers] = useState<any[]>([]);
	const [waitingList, setWaitingList] = useState<any[]>([]);
	const { isAdmin } = useContext(AdminContext);
	const [user] = useAuthState(auth);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (!roomCode || Array.isArray(roomCode)) {
			return;
		}
		const roomDocRef = doc(db, 'rooms', roomCode);

		const unsubscribe = onSnapshot(roomDocRef, (docSnap) => {
			if (docSnap.exists()) {
				const { players } = docSnap.data();
				const acceptedPlayers: any[] = [];
				const waitingPlayers: any[] = [];

				players.map((player: any) => {
					if (player.status === 'accepted')
						acceptedPlayers.push(player);
					if (player.status === 'pending')
						waitingPlayers.push(player);
				});

				setPlayers(acceptedPlayers);
				setWaitingList(waitingPlayers);
			} else {
				console.log('Room does not exist!');
			}
		});

		return () => unsubscribe();
	}, [roomCode]);

	const onClickReady = async () => {
		fetch(`/api/room/${roomCode}/player/${user?.uid}`, {
			method: 'PATCH',
			body: JSON.stringify({ key: 'isReady', value: true }),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		setIsReady(true);
	};

	const onNotClickReady = async () => {
		fetch(`/api/room/${roomCode}/player/${user?.uid}`, {
			method: 'PATCH',
			body: JSON.stringify({ key: 'isReady', value: false }),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		setIsReady(false);
	};

	return (
		<div className="flex flex-col">
			<h1 className="white-text text-center text-2xl mb-5">{roomCode}</h1>
			{isAdmin && (
				<Link href={`/room/${roomCode}/waiting-list`}>
					<p className="white-text  text-xl mb-5">
						Waiting List {waitingList.length}
					</p>
				</Link>
			)}
			<div>
				<p className="white-text  text-xl mb-5">Players</p>
				<PlayersList players={players} isWaitingList={false} />
			</div>
			{isReady ? (
				<Button onClick={onNotClickReady}>Not Ready</Button>
			) : (
				<Button onClick={onClickReady}>Ready</Button>
			)}
			{isAdmin && (
				<Button disabled={players.some((player) => !player.isReady)}>
					Start
				</Button>
			)}
		</div>
	);
};

export default RoomLobby;
