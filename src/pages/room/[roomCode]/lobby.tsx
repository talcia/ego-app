import Button from '@/components/button/button';
import PlayersList from '@/components/players-list/players-list';
import { NextPageWithLayout } from '@/pages/_app';
import PlayerContext from '@/store/player-context';
import RoundContext from '@/store/round-context';
import { auth, db } from '@/utils/db/firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Logo from '@/components/logo/logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGear } from '@fortawesome/free-solid-svg-icons';

const RoomLobby: NextPageWithLayout = () => {
	const router = useRouter();
	const {
		query: { roomCode },
	} = router;
	const [players, setPlayers] = useState<any[]>([]);
	const [waitingList, setWaitingList] = useState<any[]>([]);
	const { isAdmin, setIsAdmin, setPoints, setIsEliminated } =
		useContext(PlayerContext);
	const [user] = useAuthState(auth);
	const [isReady, setIsReady] = useState(false);
	const { setNumberOfRounds } = useContext(RoundContext);

	useEffect(() => {
		if (!roomCode || Array.isArray(roomCode)) {
			return;
		}

		const roomDocRef = doc(db, 'rooms', roomCode);

		const unsubscribe = onSnapshot(roomDocRef, (docSnap) => {
			if (docSnap.exists()) {
				const { status, numberOfRounds, owner, initialPoints } =
					docSnap.data();
				if (owner === user?.uid) {
					setIsAdmin(true);
				}
				setNumberOfRounds(numberOfRounds);
				setPoints(initialPoints);
				setIsEliminated(false);
				if (status === 'started') {
					router.push(`/room/${roomCode}/round`);
				}
			}
		});

		return () => unsubscribe();
	}, [
		roomCode,
		router,
		setIsAdmin,
		setIsEliminated,
		setNumberOfRounds,
		setPoints,
		user?.uid,
	]);

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
			const acceptedPlayers: any[] = [];
			const waitingPlayers: any[] = [];

			players.map((player: any) => {
				if (player.status === 'accepted') acceptedPlayers.push(player);
				if (player.status === 'pending') waitingPlayers.push(player);
			});

			setPlayers(acceptedPlayers);
			setWaitingList(waitingPlayers);
		});

		return () => unsubscribe();
	}, [roomCode, router]);

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

	const onStartClick = () => {
		fetch(`/api/room/${roomCode}/start`, { method: 'POST' });
	};

	const onGearIconClick = () => {
		router.push(`/room/${roomCode}/settings`);
	};

	return (
		<div className="flex flex-col">
			<div className="w-full flex gap-20 items-center justify-between  text-customWhite my-3">
				<FontAwesomeIcon
					icon={faArrowLeft}
					// onClick={onBackIconClick}
					className="cursor-pointer"
				/>
				<Logo variant="small" />
				<FontAwesomeIcon
					icon={faGear}
					onClick={onGearIconClick}
					className="cursor-pointer"
				/>
			</div>
			<h1 className="text-customWhite text-center text-2xl mb-6">
				{roomCode}
			</h1>
			{isAdmin && (
				<Link href={`/room/${roomCode}/waiting-list`}>
					<p className="text-customWhite  text-xl mb-5">
						Waiting List {waitingList.length}
					</p>
				</Link>
			)}
			<div>
				<p className="text-customWhite  text-xl mb-5">Players</p>
				<PlayersList players={players} isWaitingList={false} />
			</div>
			{isReady ? (
				<Button onClick={onNotClickReady}>Not Ready</Button>
			) : (
				<Button onClick={onClickReady}>Ready</Button>
			)}
			{isAdmin && (
				<Button
					disabled={
						!isReady || players.some((player) => !player.isReady)
					}
					onClick={onStartClick}
				>
					Start
				</Button>
			)}
		</div>
	);
};

export default RoomLobby;
