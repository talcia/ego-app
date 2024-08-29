import { getRoomByCode } from '@/utils/api/rooms';
import { db } from '@/utils/db/firebase';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
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

		try {
			await updateDoc(resposne.roomRef, {
				players: arrayUnion({
					...user,
					admin: false,
					status: 'pending',
				}),
			});
			res.status(201).json({ message: 'User added' });
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
};

export default handler;
