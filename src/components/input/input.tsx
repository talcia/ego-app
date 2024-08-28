import styles from './input.module.scss';

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
	label: string;
	isInvalid?: boolean;
	errorMessage?: string;
}

const Input: React.FC<InputProps> = ({
	label,
	isInvalid,
	errorMessage,
	...props
}) => {
	return (
		<div className="mb-2">
			<label className={`block text-sm mb-2 white-text`} htmlFor={label}>
				{label}
			</label>
			<input
				id={label}
				{...props}
				className={`shadow appearance-none border rounded w-full py-2 px-3  text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
					styles.input
				} ${isInvalid && 'border-red-500 text-red-600'}`}
			/>
			{isInvalid && errorMessage && (
				<p className="block text-sm text-red-600">{errorMessage}</p>
			)}
		</div>
	);
};

export default Input;
