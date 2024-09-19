import Logo from '@/components/logo/logo';
import { getSessionUser } from '@/utils/auth/server-auth';
import { db } from '@/utils/db/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { GetServerSideProps } from 'next';
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

		const roundCollection = collection(db, 'rooms', roomCode, 'rounds');

		const unsubscribe = onSnapshot(roundCollection, (docSnap) => {
			const rounds = docSnap.docs;
			if (rounds.length) {
				router.replace(`/room/${roomCode}/round/${1}`);
			}
		});
		return () => unsubscribe();
	}, [roomCode, router]);

	return (
		<>
			<Logo />
			<h1 className="text-customWhite text-center text-2xl mb-5">
				Starting...
			</h1>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	return getSessionUser(context);
};

export default StartingPage;
