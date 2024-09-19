import { updatePlayer } from '@/utils/api/players';
import { getRoomByCode } from '@/utils/api/rooms';
import { db } from '@/utils/db/firebase';
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	setDoc,
	updateDoc,
} from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

// api/room/roomCode/player/playerID
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'DELETE') {
		const { playerId, roomCode } = req.query;

		const resposne = await updatePlayer(
			roomCode as string,
			playerId as string,
			'status',
			'decline'
		);

		if (!resposne) {
			return;
		}

		try {
			const { room, roomRef } = (await getRoomByCode(req, res)) || {};
			const roomData = room?.data();
			if (roomData?.owner === playerId) {
				await updateDoc(roomRef!, { status: 'terminated' });
				await deleteDoc(roomRef!);
				const playersRef = await collection(
					db,
					'rooms',
					roomCode as string,
					'players'
				);
				const docs = await getDocs(playersRef);
				for (const player of docs.docs) {
					const playerRef = doc(
						db,
						'rooms',
						roomCode as string,
						'players',
						player.id as string
					);
					await deleteDoc(playerRef);
				}
			} else {
				const { updatedPlayer, playerCollection } = resposne;

				await setDoc(playerCollection, updatedPlayer);
				await deleteDoc(playerCollection);
			}

			res.status(201).json({ message: 'User deleted' });
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
	if (req.method === 'POST') {
		const { playerId, roomCode } = req.query;

		const resposne = await updatePlayer(
			roomCode as string,
			playerId as string,
			'status',
			'accepted'
		);

		if (!resposne) {
			return;
		}

		try {
			const { updatedPlayer, playerCollection } = resposne;
			await setDoc(playerCollection, updatedPlayer);
			res.status(201).json({ message: 'User added' });
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
	if (req.method === 'PATCH') {
		const { roomCode, playerId } = req.query;
		const { key, value } = req.body;

		const resposne = await updatePlayer(
			roomCode as string,
			playerId as string,
			key,
			value
		);

		if (!resposne) {
			return;
		}

		try {
			const { updatedPlayer, playerCollection } = resposne;

			await updateDoc(playerCollection, updatedPlayer);
			res.status(201).json({ message: 'User added' });
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
};

export default handler;
