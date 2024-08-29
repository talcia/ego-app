import styles from './button.module.scss';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
	variant?: 'white' | 'red';
}

const Button: React.FC<ButtonProps> = ({
	variant = 'red',
	children,
	...props
}) => (
	<button
		className={`bg-btn font-bold py-2 px-4 my-2  rounded min-w-40 w-full disabled:bg-gray-400 disabled:cursor-not-allowed ${styles[variant]}`}
		{...props}
	>
		{children}
	</button>
);

export default Button;
