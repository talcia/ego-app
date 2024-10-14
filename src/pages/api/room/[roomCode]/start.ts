import { getRoomByCode } from '@/utils/api/rooms';
import { getPlayersArray, getShuffledQuestionArray } from '@/utils/api/rounds';
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

// api/room/code/start
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const response = await getRoomByCode(req, res);

		if (!response) {
			return;
		}

		const { roomRef, room } = response;

		try {
			await updateDoc(roomRef, {
				status: 'started',
			});

			const shuffledQuestionsArray = await getShuffledQuestionArray();
			const players = await getPlayersArray(roomRef);
			const numberOfRounds = room.data().numberOfRounds;

			const roundsCollection = collection(roomRef, 'rounds');
			const roundsSnapshot = await getDocs(roundsCollection);

			const deletePromises = roundsSnapshot.docs.map((document) =>
				deleteDoc(doc(db, 'rooms', 'rounds', document.id))
			);

			await Promise.all(deletePromises);

			let playerIndex = 0;
			for (let i = 1; i <= numberOfRounds; i++) {
				const { question, answers } = shuffledQuestionsArray[i];
				if (playerIndex === players.length) {
					playerIndex = 0;
				}

				const roundData = {
					question: question,
					answers: answers,
					playersAnswers: players.map((player: { id: string }) => ({
						id: player.id,
						answer: '',
						coin: 0,
						isReady: false,
						isEliminated: false,
						isReadyForNextRound: false,
					})),
					questionAboutPlayer: {
						name: players[playerIndex].name,
						id: players[playerIndex].id,
					},
					correctAnswer: '',
					eliminatedPlayers: [],
					endGame: false,
				};
				const roundRef = doc(roundsCollection, String(i));
				await setDoc(roundRef, roundData);
				playerIndex += 1;
			}

			res.status(201).json({ message: 'Room started' });
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
};

export default handler;
