import '@testing-library/jest-dom';
import handler from '@/pages/api/room/[roomCode]/round/[roundNumber]/index';
import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import { doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import * as helpers from '@/utils/api/rounds';

jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('next-auth', () => ({
	__esModule: true,
	default: jest.fn(), // Mock NextAuth
	getServerSession: jest.fn(),
}));
jest.mock('@/utils/api/rounds');

describe('/api/room/[roomCode]/round/[roundNumber]', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	it('should return 201 status and update room', async () => {
		(helpers.updatePlayerAnswer as jest.Mock).mockResolvedValue({
			updatedPlayers: [],
			roundCollection: [],
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
			message: 'Answer added',
		});
		expect(res._getStatusCode()).toEqual(201);
	});

	it('should return 500 status', async () => {
		(updateDoc as jest.Mock).mockImplementationOnce(() => {
			throw new Error('error');
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

	it('should return 500 status for GET', async () => {
		(doc as jest.Mock).mockImplementationOnce(() => {
			throw new Error('error');
		});

		const { req, res } = createMocks({
			method: 'GET',
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

	it('should return round data and 201 status', async () => {
		(getDoc as jest.Mock).mockResolvedValueOnce({
			data: () => ({ roundNumber: 1 }),
		});

		const { req, res } = createMocks({
			method: 'GET',
		});

		await handler(
			req as unknown as NextApiRequest,
			res as unknown as NextApiResponse
		);

		expect(res._getJSONData()).toEqual({
			roundNumber: 1,
		});
		expect(res._getStatusCode()).toEqual(201);
	});
});
