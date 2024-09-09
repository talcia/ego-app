interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
	variant?: 'customWhite' | 'customRed';
	font?: 'bold' | 'normal';
}

const Button: React.FC<ButtonProps> = ({
	variant = 'customRed',
	children,
	font,
	...props
}) => (
	<button
		className={`bg-${variant} text-${
			variant === 'customRed' ? 'customWhite' : 'customBlack'
		} bg-customRed py-4 px-6 my-2 font-${font} rounded-3xl min-w-40 w-full disabled:bg-gray-400 disabled:cursor-not-allowed `}
		{...props}
	>
		{children}
	</button>
);

export default Button;
