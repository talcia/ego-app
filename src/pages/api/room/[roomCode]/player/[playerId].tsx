import { updatePlayer } from '@/utils/api/players';
import { deleteDoc, setDoc, updateDoc } from 'firebase/firestore';
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
			const { updatedPlayer, playerCollection } = resposne;

			await setDoc(playerCollection, updatedPlayer);
			await deleteDoc(playerCollection);
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
