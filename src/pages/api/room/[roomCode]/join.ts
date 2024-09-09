import { getRoomByCode } from '@/utils/api/rooms';
import { collection, doc, setDoc } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

// api/room
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const { user } = req.body as unknown as {
			user: any;
		};

		const resposne = await getRoomByCode(req, res);

		if (!resposne) {
			return;
		}

		const { roomRef, room } = resposne;
		const initialPoints = room.data().initialPoints;

		try {
			const playersCollection = collection(roomRef, 'players');
			const playerRef = doc(playersCollection, user.id);
			await setDoc(playerRef, {
				...user,
				points: initialPoints,
				admin: false,
				status: 'pending',
			});
			res.status(201).json({ message: 'User added' });
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
};

export default handler;
