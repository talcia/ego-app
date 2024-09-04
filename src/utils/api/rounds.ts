import { doc, getDoc } from 'firebase/firestore';
import { db } from '../db/firebase';

interface PlayerData {
	id?: string;
	answer?: string;
	coin?: number;
	isReady?: boolean;
	isReadyForNextRound?: boolean;
}

export const updatePlayerAnswer = async (
	roomCode: string,
	roundNumber: string,
	playerData: PlayerData
) => {
	const roundCollection = doc(
		db,
		'rooms',
		roomCode,
		'rounds',
		roundNumber as string
	);
	const roundDoc = await getDoc(roundCollection);

	if (!roundDoc.exists()) {
		return;
	}

	const roundData = roundDoc.data();
	const updatedPlayers = roundData.playersAnswers.map((player: any) => {
		if (player.id === playerData.id) {
			return { ...player, ...playerData };
		}
		return player;
	});

	return { updatedPlayers, roundCollection };
};

interface PushPlayerAnswerProps {
	playerData: PlayerData;
	userId?: string;
	roomCode: string;
	roundNumber: string;
}

export const pushPlayerAnswer = async ({
	roomCode,
	roundNumber,
	playerData,
	userId,
}: PushPlayerAnswerProps) => {
	fetch(`/api/room/${roomCode}/round/${roundNumber}`, {
		method: 'POST',
		body: JSON.stringify({
			playerData: {
				id: playerData.id,
				answer: playerData.answer,
				coin: playerData.coin,
				isReady: !playerData.isReady,
				isReadyForNextRound: false,
			},
			...(playerData.id === userId && {
				correctAnswer: playerData.isReady ? null : playerData.answer,
			}),
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
