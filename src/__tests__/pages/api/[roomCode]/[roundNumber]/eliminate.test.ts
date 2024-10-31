import '@testing-library/jest-dom';
import handler from '@/pages/api/room/[roomCode]/round/[roundNumber]/eliminate';
import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import { getDoc, getDocs, updateDoc } from 'firebase/firestore';

jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('next-auth', () => ({
	__esModule: true,
	default: jest.fn(), // Mock NextAuth
	getServerSession: jest.fn(),
}));

describe('/api/room/[roomCode]/round/[roundNumber]/eliminate', () => {
	it('should return 201 status and update room', async () => {
		(getDoc as jest.Mock).mockResolvedValue({
			exists: () => true,
			data: () => ({
				eliminatedPlayers: [],
			}),
		});
		(getDocs as jest.Mock).mockResolvedValue({
			docs: [],
		});
		const { req, res } = createMocks({
			method: 'POST',
		});

		await handler(
			req as unknown as NextApiRequest,
			res as unknown as NextApiResponse
		);

		expect(updateDoc).toHaveBeenCalled();
		expect(res._getJSONData()).toEqual({
			message: 'Player eliminated',
		});
		expect(res._getStatusCode()).toEqual(201);
	});

	it('should return 500 status', async () => {
		(updateDoc as jest.Mock).mockImplementation(() => {
			throw new Error('error');
		});
		(getDoc as jest.Mock).mockResolvedValueOnce({
			exists: () => true,
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
