import Button from '@/components/button/button';
import { auth, db } from '@/utils/db/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const WaitPage = () => {
	const router = useRouter();
	const { roomCode } = router.query;
	const [user] = useAuthState(auth);

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

	const handleCancel = () => {
		fetch(`/api/room/${router.query.roomCode}/player/${user?.uid}`, {
			method: 'DELETE',
		});
		router.back();
	};

	return (
		<div className="flex flex-col items-center w-60">
			<p className="block text-sm mb-2 white-text">
				Waiting for the admins permission to join the room
			</p>
			<br />
			<p className="block text-sm mb-2 white-text">
				{router.query.roomCode}
			</p>
			<br />
			<div
				className="mb-10 inline-block white-text h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
				role="status"
			></div>
			<Button onClick={handleCancel}>Cancel</Button>
		</div>
	);
};

export default WaitPage;
