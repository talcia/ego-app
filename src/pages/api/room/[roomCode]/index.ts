import { db } from '@/utils/db/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

// api/room/roomcode
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const { rounds, points } = req.body as unknown as {
			rounds: number;
			points: number;
		};
		const roomCode = req.query.roomCode as string;

		try {
			const roomRef = doc(db, 'rooms', roomCode);

			await updateDoc(roomRef, {
				numberOfRounds: rounds,
				initialPoints: points,
			});

			res.status(201).json({ message: 'Room updated' });
		} catch (e) {
			console.log(e);
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
};

export default handler;
