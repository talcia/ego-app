import '@testing-library/jest-dom';
import handler from '@/pages/api/room/[roomCode]/join';
import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDoc, setDoc, updateDoc } from 'firebase/firestore';

jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('next-auth', () => ({
	__esModule: true,
	default: jest.fn(), // Mock NextAuth
	getServerSession: jest.fn(),
}));

describe('/api/room/[roomCode]/join', () => {
	it('should return 400 beacuse room not exists', async () => {
		(getDoc as jest.Mock).mockResolvedValueOnce({ exists: () => false });
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

		expect(updateDoc).not.toHaveBeenCalled();
		expect(res._getJSONData()).toEqual({
			message: 'Room with that name doesnt exists',
		});
		expect(res._getStatusCode()).toEqual(400);
	});

	it('should return 201 status and add player', async () => {
		(getDoc as jest.Mock).mockResolvedValueOnce({
			exists: () => true,
			data: () => {},
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

		expect(setDoc).toHaveBeenCalled();
		expect(res._getJSONData()).toEqual({
			message: 'User added',
		});
		expect(res._getStatusCode()).toEqual(201);
	});

	it('should return 500 status', async () => {
		(collection as jest.Mock).mockImplementation(() => {
			throw new Error('error');
		});
		(getDoc as jest.Mock).mockResolvedValueOnce({
			exists: () => true,
			data: () => {},
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

		expect(updateDoc).not.toHaveBeenCalled();
		expect(res._getJSONData()).toEqual({
			message: 'Oops! Something went wrong. Please try again.',
		});
		expect(res._getStatusCode()).toEqual(500);
	});
});
