import '@testing-library/jest-dom';
import handler from '@/pages/api/room/[roomCode]/lobby';
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

describe('/api/room/[roomCode]/lobby', () => {
	it('should return 201 status and update room', async () => {
		(getDoc as jest.Mock).mockResolvedValueOnce({
			exists: () => true,
			data: () => ({
				initialPoints: 3,
			}),
		});
		(getDocs as jest.Mock).mockResolvedValue({
			docs: [],
		});
		const { req, res } = createMocks({
			method: 'POST',
			body: {
				user: { id: 'user' },
			},
		});

		await handler(
			req as unknown as NextApiRequest,
			res as unknown as NextApiResponse
		);

		expect(updateDoc).toHaveBeenCalled();
		expect(res._getJSONData()).toEqual({
			message: 'Room restarted',
		});
		expect(res._getStatusCode()).toEqual(200);
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
			body: {
				user: { id: 'user' },
			},
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
