import { updatePlayerAnswer } from '@/utils/api/rounds';
import { db } from '@/utils/db/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

// api/room/roomCode/round/roundNumber
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const { roomCode, roundNumber } = req.query;
		const { playerData, correctAnswer } = req.body;

		const response = await updatePlayerAnswer(
			roomCode as string,
			roundNumber as string,
			playerData
		);
		if (!response) {
			return;
		}

		try {
			const { updatedPlayers, roundCollection } = response;
			await updateDoc(roundCollection, {
				playersAnswers: updatedPlayers,
				...(correctAnswer !== undefined && { correctAnswer }),
			});
			res.status(201).json({ message: 'Answer added' });
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' });
		}
	} else if (req.method === 'GET') {
		const { roomCode, roundNumber } = req.query;

		try {
			const roundCollection = doc(
				db,
				'rooms',
				roomCode as string,
				'rounds',
				roundNumber as string
			);

			const roundDoc = await getDoc(roundCollection);
			const roundData = roundDoc.data() || {};

			res.status(201).json(roundData);
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
};

export default handler;
