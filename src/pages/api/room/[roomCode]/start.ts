import { getRoomByCode } from '@/utils/api/rooms';
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

		try {
			await updateDoc(response.roomRef, {
				status: 'started',
			});
			const playersColelction = collection(response.roomRef, 'players');
			const playersSnapshot = await getDocs(playersColelction);
			const players = playersSnapshot.docs.map((doc) => ({
				id: doc.id,
				name: doc.data().name,
				avatar: doc.data().avatar,
			}));
			const roundsCollection = collection(response.roomRef, 'rounds');
			const roundData = {
				roundNumber: 1,
				question: 'which situation scares you the most',
				answers: [
					{ id: '1', label: 'bat tangled in hair' },
					{ id: '2', label: 'mouse under the covers' },
					{ id: '3', label: 'long black hair in the soup' },
				],
				playersAnswers: players.map((player: any) => ({
					id: player.id,
					answer: '',
					coin: 0,
					isReady: false,
					isReadyForNextRound: false,
				})),
				questionAboutPlayer: {
					name: players[0].name,
					id: players[0].id,
					avatar: players[0].avatar,
				},
				correctAnswer: '',
			};
			const roundRef = doc(roundsCollection, '1');
			await setDoc(roundRef, roundData);

			const roundData2 = {
				roundNumber: 2,
				question: 'which situation scares you the most ',
				answers: [
					{ id: '1', label: 'bat tangled in hair 2 ' },
					{ id: '2', label: 'mouse under the covers 2 ' },
					{ id: '3', label: 'long black hair in the soup2 2' },
				],
				playersAnswers: players.map((player: any) => ({
					id: player.id,
					answer: '',
					coin: 0,
					isReady: false,
					isReadyForNextRound: false,
				})),
				questionAboutPlayer: {
					name: players[1].name,
					id: players[1].id,
					avatar: players[1].avatar,
				},
				correctAnswer: '',
			};
			const roundRef2 = doc(roundsCollection, '2');
			await setDoc(roundRef2, roundData2);

			res.status(201).json({ message: 'Room started' });
		} catch (e) {
			console.log(e);
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
};

export default handler;
