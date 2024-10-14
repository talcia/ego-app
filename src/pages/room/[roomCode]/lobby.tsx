import Button from '@/components/button/button';
import PlayersList from '@/components/players-list/players-list';
import { NextPageWithLayout } from '@/pages/_app';
import PlayerContext from '@/store/player-context';
import RoundContext from '@/store/round-context';
import { db } from '@/utils/db/firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Logo from '@/components/logo/logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGear } from '@fortawesome/free-solid-svg-icons';
import { PlayerInLobby } from '@/types/room-types';
import { useUserSession } from '@/hooks/useUserSession';
import { canUserAccessRoom, getRoomData } from '@/utils/api/rooms';
import { GetServerSideProps } from 'next';

const RoomLobby: NextPageWithLayout = () => {
	const router = useRouter();
	const {
		query: { roomCode },
	} = router;
	const [players, setPlayers] = useState<PlayerInLobby[]>([]);
	const [waitingList, setWaitingList] = useState<PlayerInLobby[]>([]);
	const { isAdmin, setIsAdmin, setPoints, setIsEliminated } =
		useContext(PlayerContext);
	const [isReady, setIsReady] = useState(false);
	const { setNumberOfRounds } = useContext(RoundContext);
	const [isLoading, setIsLoading] = useState(false);
	const { id } = useUserSession();

	useEffect(() => {
		if (!roomCode || Array.isArray(roomCode)) {
			return;
		}

		const roomDocRef = doc(db, 'rooms', roomCode);

		const unsubscribe = onSnapshot(roomDocRef, (docSnap) => {
			if (docSnap.exists()) {
				const { status, numberOfRounds, owner, initialPoints } =
					docSnap.data();
				if (owner === id) {
					setIsAdmin(true);
				}
				setNumberOfRounds(numberOfRounds);
				setPoints(initialPoints);
				setIsEliminated(false);
				if (status === 'started') {
					router.replace(`/room/${roomCode}/round`);
				} else if (status === 'terminated') {
					router.replace('/profile');
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
		id,
	]);

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
			const acceptedPlayers: PlayerInLobby[] = [];
			const waitingPlayers: PlayerInLobby[] = [];

			players.map((player) => {
				if (player.status === 'accepted') acceptedPlayers.push(player);
				if (player.status === 'pending') waitingPlayers.push(player);
			});

			setPlayers(acceptedPlayers);
			setWaitingList(waitingPlayers);
		});

		return () => unsubscribe();
	}, [roomCode, router]);

	const onClickReady = async () => {
		fetch(`/api/room/${roomCode}/player/${id}`, {
			method: 'PATCH',
			body: JSON.stringify({ key: 'isReady', value: true }),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		setIsReady(true);
	};

	const onNotClickReady = async () => {
		fetch(`/api/room/${roomCode}/player/${id}`, {
			method: 'PATCH',
			body: JSON.stringify({ key: 'isReady', value: false }),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		setIsReady(false);
	};

	const onStartClick = async () => {
		setIsLoading(true);
		await fetch(`/api/room/${roomCode}/start`, { method: 'POST' });
		setIsLoading(false);
	};

	const onGearIconClick = () => {
		router.push(`/room/${roomCode}/settings`);
	};

	const onBackIconClick = async () => {
		await fetch(`/api/room/${router.query.roomCode}/player/${id}`, {
			method: 'DELETE',
		});
		router.replace('/profile');
	};

	return (
		<div className="flex flex-col min-w-[250px]">
			<div className="w-full flex gap-20 items-center justify-between  text-customWhite my-3">
				<FontAwesomeIcon
					icon={faArrowLeft}
					onClick={onBackIconClick}
					className="cursor-pointer"
				/>
				<Logo variant="small" clickable={false} />
				{isAdmin && (
					<FontAwesomeIcon
						icon={faGear}
						onClick={onGearIconClick}
						className="cursor-pointer"
					/>
				)}
			</div>
			<h1 className="text-customWhite text-center text-2xl mb-6">
				{roomCode}
			</h1>
			{isAdmin && (
				<Link href={`/room/${roomCode}/waiting-list`}>
					<p
						className={`${
							waitingList.length
								? 'text-customYellow'
								: 'text-customWhite'
						} text-xl mb-5`}
					>
						Waiting List {waitingList.length}
					</p>
				</Link>
			)}
			<div className="my-8">
				<p className="text-customWhite text-center text-xl ">Players</p>
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
					isLoading={isLoading}
				>
					Start
				</Button>
			)}
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { roomCode } = context.params!;

	const roomData = await getRoomData(roomCode as string);
	const canAccess = await canUserAccessRoom(roomCode as string, context.req);

	if (!roomData || !canAccess) {
		return { notFound: true };
	}

	return {
		props: {},
	};
};

export default RoomLobby;
