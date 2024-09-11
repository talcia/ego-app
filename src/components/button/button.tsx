import Spinner from '../spinner/spinner';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
	variant?: 'customWhite' | 'customRed';
	font?: 'bold' | 'normal';
	isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	variant = 'customRed',
	children,
	font,
	isLoading = false,
	...props
}) => (
	<button
		className={`bg-${variant} text-${
			variant === 'customRed' ? 'customWhite' : 'customBlack'
		} bg-customRed py-4 px-6 my-2 font-${font} rounded-3xl min-w-40 w-full disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md shadow-customBlack`}
		{...props}
	>
		{isLoading ? (
			<Spinner
				size={4}
				color={variant === 'customRed' ? 'customWhite' : 'customRed'}
			/>
		) : (
			children
		)}
	</button>
);

export default Button;
