import { getRoomByCode } from '@/utils/api/rooms';
import { db } from '@/utils/db/firebase';
import {
	arrayUnion,
	collection,
	doc,
	getDoc,
	getDocs,
	updateDoc,
} from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

// api/room/code/round/roundnumber/eliminate
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const { roomCode, roundNumber } = req.query;
		const response = await getRoomByCode(req, res);

		if (!response) {
			return;
		}

		const { room, roomRef } = response;

		try {
			const roomData = room.data();

			const playersCollection = collection(
				db,
				'rooms',
				roomCode as string,
				'players'
			);
			const playersDocs = await getDocs(playersCollection);
			const players = playersDocs.docs;

			await updateDoc(roomRef, {
				eliminatedPlayers: arrayUnion(req.body.userId),
			});

			const roundCollection = doc(
				db,
				'rooms',
				roomCode as string,
				'rounds',
				roundNumber as string
			);
			const roundDoc = await getDoc(roundCollection);

			if (!roundDoc.exists()) {
				return;
			}

			await updateDoc(roundCollection, {
				eliminatedPlayers: arrayUnion(req.body.userId),
				...(roomData.eliminatedPlayers.length + 1 ===
					players.length - 1 && { endGame: true }),
			});

			res.status(201).json({ message: 'Player eliminated' });
		} catch (e) {
			res.status(500).json({
				message: 'Oops! Something went wrong. Please try again.',
			});
		}
	}
};

export default handler;
