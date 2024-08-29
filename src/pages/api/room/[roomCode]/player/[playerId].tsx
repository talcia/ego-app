import { updatePlayersArray } from '@/utils/api/players';
import { getRoomByCode } from '@/utils/api/rooms';
import { db } from '@/utils/db/firebase';
import {
	arrayRemove,
	arrayUnion,
	doc,
	getDoc,
	updateDoc,
} from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

// api/room/roomCode/player/playerID
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'DELETE') {
		const { playerId } = req.query;
		const resposne = await getRoomByCode(req, res);

		if (!resposne) {
			return;
		}

		const { roomRef, room } = resposne;

		try {
			const { players } = room.data();
			let playerToRemove;
			const updatedPlayers = players.map((player: any) => {
				if (player.id === playerId) {
					playerToRemove = { ...player, status: 'decline' };
					return { ...player, status: 'decline' };
				}
				return player;
			});

			await updateDoc(roomRef, {
				players: updatedPlayers,
			});
			await updateDoc(roomRef, {
				players: arrayRemove(playerToRemove),
			});
			res.status(201).json({ message: 'User added' });
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
	if (req.method === 'POST') {
		const { playerId, roomCode } = req.query;
		const resposne = await getRoomByCode(req, res);

		if (!resposne) {
			return;
		}

		const { roomRef } = resposne;
		try {
			const updatedPlayers = await updatePlayersArray(
				roomCode as string,
				playerId as string,
				'status',
				'accepted'
			);
			await updateDoc(roomRef, {
				players: updatedPlayers,
			});
			res.status(201).json({ message: 'User added' });
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
	if (req.method === 'PATCH') {
		const { roomCode, playerId } = req.query;
		const { key, value } = req.body;
		const resposne = await getRoomByCode(req, res);

		if (!resposne) {
			return;
		}

		const { roomRef } = resposne;
		try {
			const updatedPlayers = await updatePlayersArray(
				roomCode as string,
				playerId as string,
				key,
				value
			);
			await updateDoc(roomRef, {
				players: updatedPlayers,
			});
			res.status(201).json({ message: 'User added' });
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
};

export default handler;
