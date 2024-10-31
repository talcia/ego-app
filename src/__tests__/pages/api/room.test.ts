import '@testing-library/jest-dom';
import handler from '@/pages/api/room/index';
import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { getDoc, setDoc } from 'firebase/firestore';

jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('next-auth', () => ({
	__esModule: true,
	default: jest.fn(), // Mock NextAuth
	getServerSession: jest.fn(),
}));

describe('/api/room', () => {
	it('should return 401 with error', async () => {
		(getServerSession as jest.Mock).mockResolvedValueOnce(null);
		const { req, res } = createMocks({
			method: 'POST',
		});

		await handler(
			req as unknown as NextApiRequest,
			res as unknown as NextApiResponse
		);

		expect(res._getJSONData()).toEqual({ message: 'Not autheticated' });
		expect(res._getStatusCode()).toEqual(401);
	});

	it('should return 400 status when room already exists', async () => {
		(getServerSession as jest.Mock).mockResolvedValueOnce({});
		(getDoc as jest.Mock).mockResolvedValueOnce({ exists: () => true });
		const { req, res } = createMocks({
			method: 'POST',
			body: {
				roomCode: '1',
				user: { id: 'id' },
				numberofRounds: 2,
				initialPoints: 3,
			},
		});

		await handler(
			req as unknown as NextApiRequest,
			res as unknown as NextApiResponse
		);

		expect(setDoc).not.toHaveBeenCalled();
		expect(res._getJSONData()).toEqual({
			message: 'Room with that name already exists',
		});
		expect(res._getStatusCode()).toEqual(400);
	});

	it('should create room and return 201 status', async () => {
		(getServerSession as jest.Mock).mockResolvedValueOnce({});
		(getDoc as jest.Mock).mockResolvedValueOnce({ exists: () => false });
		const { req, res } = createMocks({
			method: 'POST',
			body: {
				roomCode: '1',
				user: { id: 'id' },
				numberofRounds: 2,
				initialPoints: 3,
			},
		});

		await handler(
			req as unknown as NextApiRequest,
			res as unknown as NextApiResponse
		);

		expect(setDoc).toHaveBeenCalled();
		expect(setDoc).toHaveBeenCalledWith(undefined, {
			_id: '1',
			eliminatedPlayers: [],
			initialPoints: 3,
			isPrivate: false,
			numberOfRounds: undefined,
			owner: 'id',
			status: 'pending',
		});
		expect(res._getJSONData()).toEqual({ message: 'Room created' });
		expect(res._getStatusCode()).toEqual(201);
	});
});
