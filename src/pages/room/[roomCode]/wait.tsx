import Button from '@/components/button/button';
import Logo from '@/components/logo/logo';
import Spinner from '@/components/spinner/spinner';

import { db } from '@/utils/db/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PlayerInLobby } from '@/types/room-types';
import { useUserSession } from '@/hooks/useUserSession';
import { GetServerSideProps } from 'next';
import { canUserAccessRoom, getRoomData } from '@/utils/api/rooms';

const WaitPage: React.FC = () => {
	const router = useRouter();
	const { roomCode } = router.query;
	const [isLoading, setIsLoading] = useState(false);
	const { id } = useUserSession();

	useEffect(() => {
		if (!roomCode || Array.isArray(roomCode)) {
			return;
		}
		const roomDocRef = collection(db, 'rooms', roomCode, 'players');

		const unsubscribe = onSnapshot(roomDocRef, (docSnap) => {
			const players = docSnap.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as PlayerInLobby[];
			const player = players.find((player) => player.id === id);
			if (!player) {
				router.back();
			}
			if (player?.status === 'accepted') {
				router.replace(`/room/${roomCode}/lobby`);
			}
		});

		return () => unsubscribe();
	}, [roomCode, router, id]);

	const handleCancel = async () => {
		setIsLoading(true);
		await fetch(`/api/room/${router.query.roomCode}/player/${id}`, {
			method: 'DELETE',
		});
		router.back();
		setIsLoading(false);
	};

	return (
		<div className="flex flex-col items-center w-60">
			<div className="w-full flex gap-20 items-center justify-center  text-customWhite my-3">
				<Logo variant="small" clickable={false} />
			</div>
			<p className="block text-sm mb-10 text-customWhite text-center">
				{"Waiting for the admin's approval to enter the room"}
			</p>
			<p className="block text-sm mb-6 text-customWhite">
				{router.query.roomCode}
			</p>
			<div className="mb-8">
				<Spinner />
			</div>
			<Button onClick={handleCancel} isLoading={isLoading}>
				Cancel
			</Button>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { roomCode } = context.params!;

	const roomData = await getRoomData(roomCode as string);

	const canAccess = await canUserAccessRoom(roomCode as string, context.req);

	if (!canAccess || !roomData) {
		return { notFound: true };
	}

	return {
		props: {},
	};
};

export default WaitPage;
