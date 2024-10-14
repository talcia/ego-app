import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../db/firebase';

export const updatePlayer = async (
	roomCode: string,
	playerId: string,
	key: string,
	value: string | number | boolean
) => {
	const playerCollection = doc(db, 'rooms', roomCode, 'players', playerId);

	const playerData = await getPlayerData(roomCode, playerId);

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

export const getPlayers = async (roomCode: string) => {
	const playersCollection = collection(
		db,
		'rooms',
		roomCode as string,
		'players'
	);
	const playersData = await getDocs(playersCollection);
	const players = playersData.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));

	return players;
};
