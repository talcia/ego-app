import '@testing-library/jest-dom';
import handler from '@/pages/api/room/[roomCode]/index';
import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import { doc, updateDoc } from 'firebase/firestore';

jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('next-auth', () => ({
	__esModule: true,
	default: jest.fn(), // Mock NextAuth
	getServerSession: jest.fn(),
}));

describe('/api/room/[roomCode]', () => {
	it('should return 201 status and update room', async () => {
		const { req, res } = createMocks({
			method: 'POST',
			body: {
				round: 1,
				points: 1,
			},
		});

		await handler(
			req as unknown as NextApiRequest,
			res as unknown as NextApiResponse
		);

		expect(updateDoc).toHaveBeenCalled();
		expect(res._getJSONData()).toEqual({ message: 'Room updated' });
		expect(res._getStatusCode()).toEqual(201);
	});

	it('should return 500 status', async () => {
		(doc as jest.Mock).mockImplementation(() => {
			throw new Error('error');
		});
		const { req, res } = createMocks({
			method: 'POST',
			body: {
				round: 1,
				points: 1,
			},
		});

		await handler(
			req as unknown as NextApiRequest,
			res as unknown as NextApiResponse
		);

		expect(updateDoc).not.toHaveBeenCalled();
		expect(res._getJSONData()).toEqual({
			message: 'Oops! Something went wrong. Please try again.',
		});
		expect(res._getStatusCode()).toEqual(500);
	});
});
