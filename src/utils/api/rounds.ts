import {
	collection,
	doc,
	DocumentReference,
	getDoc,
	getDocs,
} from 'firebase/firestore';
import { db } from '../db/firebase';

interface PlayerData {
	id?: string;
	answer?: string;
	coin?: number;
	isReady?: boolean;
	isReadyForNextRound?: boolean;
	isEliminated?: boolean;
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
	await fetch(`/api/room/${roomCode}/round/${roundNumber}`, {
		method: 'POST',
		body: JSON.stringify({
			playerData: {
				...playerData,
				isReadyForNextRound: false,
			},
			...(playerData.id === userId && {
				correctAnswer: playerData.answer,
			}),
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

export const getShuffledQuestionArray = async () => {
	const questionRef = collection(db, 'questions');
	const questionsData = await getDocs(questionRef);
	const questions = questionsData.docs.map((doc) => ({
		question: doc.data().question,
		answers: doc.data().answers,
	}));

	return questions.sort(() => 0.5 - Math.random());
};

export const getPlayersArray = async (roomRef: DocumentReference) => {
	const playersColelction = collection(roomRef, 'players');
	const playersSnapshot = await getDocs(playersColelction);
	const players = playersSnapshot.docs.map((doc) => ({
		id: doc.id,
		name: doc.data().name,
		avatar: doc.data().avatar,
	}));

	return players;
};

export const getRoundData = async (roomCode: string, roundNumber: string) => {
	const roundCollection = doc(db, 'rooms', roomCode, 'rounds', roundNumber);

	const roundDoc = await getDoc(roundCollection);
	const roundData = roundDoc.data() || {};
	return roundData;
};
