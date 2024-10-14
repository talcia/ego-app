import { doc, getDoc } from 'firebase/firestore';
import { db } from '../db/firebase';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getPlayers } from './players';

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

export const canUserAccessRoom = async (roomCode: string, req: any) => {
	const session = await getSession({ req: req });
	const roomData = await getRoomData(roomCode);
	const playersInRoom = await getPlayers(roomCode);

	const userId = session?.user.id;

	if (!userId) {
		return false;
	}

	if (userId === roomData?.owner) {
		return true;
	}

	if (!playersInRoom.some((player) => player.id === userId)) {
		return false;
	}

	return true;
};
