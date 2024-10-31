const nextJest = require('next/jest.js');

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './',
});

const config = {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	testEnvironment: 'jsdom',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'^next/router$': '<rootDir>/__mocks__/next/router.ts', // Map next/router to the mock
		'^firebase/(,*)$': '<rootDir>/__mocks__/firebase.ts', // Map next/router to the mock
	},
	transform: {
		// Use babel-jest to transpile tests with the next/babel preset
		// https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
		'^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
	},
	testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/.next/'],
	transformIgnorePatterns: [
		'/node_modules/(?!firebase|@firebase)',
		'^.+\\.module\\.(css|sass|scss)$',
	],
};

module.exports = createJestConfig(config);
