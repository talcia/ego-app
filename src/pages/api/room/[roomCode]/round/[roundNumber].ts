import { updatePlayerAnswer } from '@/utils/api/rounds';
import { updateDoc } from 'firebase/firestore';
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
	}
};

export default handler;
