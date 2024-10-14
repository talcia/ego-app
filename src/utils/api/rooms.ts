import { doc, getDoc } from 'firebase/firestore';
import { db } from '../db/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

export const getRoomByCode = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const roomCode = req.query.roomCode as string;
	const roomRef = doc(db, 'rooms', roomCode);
	const room = await getDoc(roomRef);

	if (!room.exists()) {
		res.status(400).json({
			message: 'Room with that name doesnt exists',
		});
	} else {
		return { room, roomRef };
	}
};

export const getRoomData = async (roomCode: string) => {
	const roomRef = doc(db, 'rooms', roomCode);
	const room = await getDoc(roomRef);

	if (!room.exists()) {
		return null;
	}

	return room.data();
};
