import '@testing-library/jest-dom';
import HomePage from '@/pages';
import { render, screen } from '@testing-library/react';

describe('Page', () => {
	it('renders a heading', () => {
		render(<HomePage />);

		const logo = screen.getByText('ego');
		const loginButton = screen.getByText('Login');
		const guestButton = screen.getByText('Play as guest');

		expect(logo).toBeInTheDocument();
		expect(loginButton).toBeInTheDocument();
		expect(guestButton).toBeInTheDocument();
	});
});
