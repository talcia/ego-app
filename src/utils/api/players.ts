import { doc, getDoc } from 'firebase/firestore';
import { db } from '../db/firebase';

export const updatePlayersArray = async (
	roomCode: string,
	playerId: string,
	key: string,
	value: any
) => {
	const roomDocRef = doc(db, 'rooms', roomCode);
	const roomDoc = await getDoc(roomDocRef);

	if (!roomDoc.exists()) {
		return 'Room doesnt exist';
	}

	const roomData = roomDoc.data();

	const updatedPlayers = roomData?.players.map((player: any) => {
		if (player.id === playerId) {
			return { ...player, [key]: value };
		}
		return player;
	});

	return updatedPlayers;
};
