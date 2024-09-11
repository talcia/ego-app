import Button from '@/components/button/button';
import Logo from '@/components/logo/logo';
import Spinner from '@/components/spinner/spinner';
import { auth, db } from '@/utils/db/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const WaitPage = () => {
	const router = useRouter();
	const { roomCode } = router.query;
	const [user] = useAuthState(auth);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!roomCode || Array.isArray(roomCode)) {
			return;
		}
		const roomDocRef = collection(db, 'rooms', roomCode, 'players');

		const unsubscribe = onSnapshot(roomDocRef, (docSnap) => {
			const players = docSnap.docs.map((doc: any) => ({
				id: doc.id,
				...doc.data(),
			}));
			const player = players.find(
				(player: any) => player.id === user?.uid
			);
			if (!player) {
				router.back();
			}
			if (player?.status === 'accepted') {
				router.push(`/room/${roomCode}/lobby`);
			}
		});

		return () => unsubscribe();
	}, [roomCode, router, user?.uid]);

	const handleCancel = async () => {
		setIsLoading(true);
		await fetch(`/api/room/${router.query.roomCode}/player/${user?.uid}`, {
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

export default WaitPage;
