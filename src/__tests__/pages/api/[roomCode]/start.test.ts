import '@testing-library/jest-dom';
import handler from '@/pages/api/room/[roomCode]/start';
import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import { getDoc, getDocs, updateDoc } from 'firebase/firestore';
import * as helpers from '@/utils/api/rounds';

jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('next-auth', () => ({
	__esModule: true,
	default: jest.fn(), // Mock NextAuth
	getServerSession: jest.fn(),
}));
jest.mock('@/utils/api/rounds');

describe('/api/room/[roomCode]/start', () => {
	it('should return 201 status and update room', async () => {
		(getDoc as jest.Mock).mockResolvedValueOnce({
			exists: () => true,
			data: () => ({
				numberOfRounds: 3,
			}),
		});
		(getDocs as jest.Mock).mockResolvedValue({
			docs: [],
		});
		(helpers.getPlayersArray as jest.Mock).mockResolvedValue([
			{ id: 'id', name: 'name' },
		]);
		(helpers.getShuffledQuestionArray as jest.Mock).mockResolvedValue([
			{ question: '', answers: [] },
		]);
		const { req, res } = createMocks({
			method: 'POST',
		});

		await handler(
			req as unknown as NextApiRequest,
			res as unknown as NextApiResponse
		);

		expect(updateDoc).toHaveBeenCalled();
		expect(res._getJSONData()).toEqual({
			message: 'Room started',
		});
		expect(res._getStatusCode()).toEqual(201);
	});

	it('should return 500 status', async () => {
		(updateDoc as jest.Mock).mockImplementation(() => {
			throw new Error('error');
		});
		(getDoc as jest.Mock).mockResolvedValueOnce({
			exists: () => true,
			data: () => ({
				initialPoints: 3,
			}),
		});

		const { req, res } = createMocks({
			method: 'POST',
		});

		await handler(
			req as unknown as NextApiRequest,
			res as unknown as NextApiResponse
		);

		expect(res._getJSONData()).toEqual({
			message: 'Oops! Something went wrong. Please try again.',
		});
		expect(res._getStatusCode()).toEqual(500);
	});
});
