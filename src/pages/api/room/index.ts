import { db } from '@/utils/db/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { authOptions } from '../auth/[...nextauth]';

// api/room
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const session = await getServerSession(req, res, authOptions);

		if (!session) {
			res.status(401).json({ message: 'Not autheticated' });
			return;
		}

		const { roomCode, user, numberOfRounds, initialPoints } =
			req.body as unknown as {
				roomCode: string;
				user: any;
				numberOfRounds: number;
				initialPoints: number;
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
					owner: user.id,
					status: 'pending',
					numberOfRounds,
					initialPoints,
					eliminatedPlayers: [],
				});
				const playersCollection = collection(roomRef, 'players');
				const userRef = doc(playersCollection, user.id);
				await setDoc(userRef, {
					...user,
					points: initialPoints,
					isReady: false,
				});
				res.status(201).json({ message: 'Room created' });
			} catch (e) {
				res.status(500).json({ message: 'Something went wrong' });
			}
		}
	}
};

export default handler;
