import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Button from '@/components/button/button';

describe('Button component', () => {
	it('renders a button', () => {
		render(<Button>Click</Button>);

		const button = screen.getByText('Click');

		expect(button).toBeInTheDocument();
		expect(button).toHaveClass('bg-customRed');
		expect(button).toHaveClass('text-customWhite');
	});

	it('renders a button in white variant and font bold', () => {
		render(
			<Button variant="customWhite" font="bold">
				Click
			</Button>
		);

		const button = screen.getByText('Click');

		expect(button).toHaveClass('bg-customWhite');
		expect(button).toHaveClass('text-customBlack');
		expect(button).toHaveClass('font-bold');
	});

	it('renders a button in loading state', () => {
		render(<Button isLoading>Click</Button>);

		const spinner = screen.getByRole('status');

		expect(spinner).toBeInTheDocument();
		expect(spinner).toHaveClass('animate-spin');
	});
});
