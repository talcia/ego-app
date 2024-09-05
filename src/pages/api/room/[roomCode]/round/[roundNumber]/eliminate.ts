import { getRoomByCode } from '@/utils/api/rooms';
import { db } from '@/utils/db/firebase';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

// api/room/code/round/roundnumber/eliminate
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const { roomCode, roundNumber } = req.query;
		const response = await getRoomByCode(req, res);

		if (!response) {
			return;
		}

		try {
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
			});

			res.status(201).json({ message: 'Player eliminated' });
		} catch (e) {
			console.log(e);
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
};

export default handler;
