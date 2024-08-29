import { db } from '@/utils/db/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

// api/room
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const { roomCode, user } = req.body as unknown as {
			roomCode: string;
			user: any;
		};
		const roomRef = doc(db, 'rooms', roomCode);
		const room = await getDoc(roomRef);

		if (room.exists()) {
			res.status(400).json({
				message: 'Room with that name already exists',
			});
		} else {
			try {
				await setDoc(doc(db, 'rooms', roomCode), {
					_id: roomCode,
					isPrivate: false,
					players: [user],
					owner: user.id,
				});
				res.status(201).json({ message: 'Room created' });
			} catch (e) {
				console.log(e);
				res.status(500).json({ message: 'Something went wrong' });
			}
		}
	}
};

export default handler;
