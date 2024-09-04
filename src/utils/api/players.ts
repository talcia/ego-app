import { doc, getDoc } from 'firebase/firestore';
import { db } from '../db/firebase';

export const updatePlayer = async (
	roomCode: string,
	playerId: string,
	key: string,
	value: any
) => {
	const playerCollection = doc(db, 'rooms', roomCode, 'players', playerId);
	const playerDoc = await getDoc(playerCollection);

	if (!playerDoc.exists()) {
		return;
	}

	const playerData = playerDoc.data();

	const updatedPlayer = { ...playerData, [key]: value };

	return { updatedPlayer, playerCollection };
};

export const getPlayerData = async (roomCode: string, playerId: string) => {
	const playerCollection = doc(db, 'rooms', roomCode, 'players', playerId);
	const playerDoc = await getDoc(playerCollection);

	if (!playerDoc.exists()) {
		return;
	}

	return playerDoc.data();
};
