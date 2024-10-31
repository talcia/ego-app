// __mocks__/firebase.js
const mockSignInWithEmailAndPassword = jest.fn(() =>
	Promise.resolve({ user: { uid: 'mockUserId' } })
);
const mockCreateUserWithEmailAndPassword = jest.fn(() =>
	Promise.resolve({ user: { uid: 'mockUserId' } })
);

export const getAuth = jest.fn(() => ({
	signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
	createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
}));

export const initializeApp = jest.fn(() => ({
	// Mock other Firebase services if necessary
}));

// You can export any other functions or variables as needed
export const auth = jest.fn(); // Add additional exports as needed

export const doc = jest.fn();
export const getDoc = jest.fn();
export const setDoc = jest.fn();
export const collection = jest.fn();
