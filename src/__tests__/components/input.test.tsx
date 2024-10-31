import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Button from '@/components/button/button';
import Input from '@/components/input/input';

describe('Input component', () => {
	it('renders a input', () => {
		render(<Input label="Input" />);

		const input = screen.getByLabelText('Input');

		expect(input).toBeInTheDocument();
	});

	it('renders a invalid input', () => {
		render(<Input label="Input" isInvalid errorMessage="error" />);

		const input = screen.getByLabelText('Input');
		const errorMessage = screen.getByText('error');

		expect(input).toHaveClass('border-customYellow');
		expect(errorMessage).toBeInTheDocument();
	});
});
