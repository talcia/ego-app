import styles from './input.module.scss';

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
	label: string;
}

const Input: React.FC<InputProps> = ({ label }) => {
	return (
		<div className="">
			<label
				className={`block text-sm mb-2 ${styles.label}`}
				htmlFor={label}
			>
				{label}
			</label>
			<input
				className={`shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${styles.input}`}
			/>
		</div>
	);
};

export default Input;
