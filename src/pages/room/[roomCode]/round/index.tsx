import Logo from '@/components/logo/logo';
import { db } from '@/utils/db/firebase';
import { collection, doc, getDocs, query } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const StartingPage = () => {
	const router = useRouter();
	const {
		query: { roomCode },
	} = router;

	useEffect(() => {
		if (!roomCode || Array.isArray(roomCode)) {
			return;
		}

		const checkIfCollectionExisit = async () => {
			const roomDocRef = doc(db, 'rooms', roomCode);
			const roundCollection = collection(roomDocRef, 'rounds');
			const q = query(roundCollection);
			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				router.push(`/room/${roomCode}/round/${1}`);
			}
		};

		checkIfCollectionExisit();
	}, [roomCode, router]);

	return (
		<>
			<Logo />
			<h1 className="white-text text-center text-2xl mb-5">
				Starting...
			</h1>
		</>
	);
};

export default StartingPage;
