import styles from './button.module.scss';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
	variant?: 'white' | 'red';
	font?: 'bold' | 'normal';
}

const Button: React.FC<ButtonProps> = ({
	variant = 'red',
	children,
	font,
	...props
}) => (
	<button
		className={`bg-btn py-2 px-4 my-2 font-${font} rounded min-w-40 w-full disabled:bg-gray-400 disabled:cursor-not-allowed ${styles[variant]}`}
		{...props}
	>
		{children}
	</button>
);

export default Button;
