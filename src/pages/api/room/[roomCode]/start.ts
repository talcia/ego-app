import { getRoomByCode } from '@/utils/api/rooms';
import { getPlayersArray, getShuffledQuestionArray } from '@/utils/api/rounds';
import {
	collection,
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

		const { roomRef } = response;

		try {
			await updateDoc(response.roomRef, {
				status: 'started',
			});

			const shuffledQuestionsArray = await getShuffledQuestionArray();
			const players = await getPlayersArray(roomRef);
			const numberOfRounds = response.room.data().numberOfRounds;

			const roundsCollection = collection(roomRef, 'rounds');

			let playerIndex = 0;
			for (let i = 0; i <= numberOfRounds; i++) {
				const { question, answers } = shuffledQuestionsArray[i];
				if (playerIndex === players.length) {
					playerIndex = 0;
				}

				const roundData = {
					question: question,
					answers: answers,
					playersAnswers: players.map((player: any) => ({
						id: player.id,
						answer: '',
						coin: 0,
						isReady: false,
						isReadyForNextRound: false,
					})),
					questionAboutPlayer: {
						name: players[playerIndex].name,
						id: players[playerIndex].id,
						avatar: players[playerIndex].avatar,
					},
					correctAnswer: '',
				};
				const roundRef = doc(roundsCollection, String(i + 1));
				await setDoc(roundRef, roundData);
				playerIndex += 1;
			}

			res.status(201).json({ message: 'Room started' });
		} catch (e) {
			console.log(e);
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
};

export default handler;
