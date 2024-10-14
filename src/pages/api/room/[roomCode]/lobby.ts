import { getRoomByCode } from '@/utils/api/rooms';
import { db } from '@/utils/db/firebase';
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	updateDoc,
} from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const response = await getRoomByCode(req, res);

		if (!response) {
			return;
		}

		const { roomRef, room } = response;
		const initialPoints = room.data().initialPoints;

		try {
			await updateDoc(roomRef, {
				status: 'pending',
				eliminatedPlayers: [],
			});

			const playersCollection = collection(
				db,
				'rooms',
				req.query.roomCode as string,
				'players'
			);
			const playersData = await getDocs(playersCollection);
			const players = playersData.docs;
			for (let player of players) {
				const playerRef = doc(
					db,
					'rooms',
					req.query.roomCode as string,
					'players',
					player.id
				);
				await updateDoc(playerRef, {
					points: initialPoints,
					isEliminated: false,
					isReady: false,
				});
			}

			const roundsCollection = collection(
				db,
				'rooms',
				req.query.roomCode as string,
				'rounds'
			);
			const roundsData = await getDocs(roundsCollection);
			const rounds = roundsData.docs;

			for (let round of rounds) {
				const roundRef = doc(
					db,
					'rooms',
					req.query.roomCode as string,
					'rounds',
					round.id
				);
				await deleteDoc(roundRef);
			}
			res.status(200).json({ message: 'Room restarted' });
		} catch (e) {
			res.status(500).json({
				message: 'Oops! Something went wrong. Please try again.',
			});
		}
	}
};

export default handler;
