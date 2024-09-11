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
		<div className="my-3">
			<label
				className={`block text-sm mb-2 ml-4 text-customWhite`}
				htmlFor={label}
			>
				{label}
			</label>
			<input
				id={label}
				{...props}
				className={`shadow appearance-none bg-transparent border rounded-3xl w-full py-4 px-6 text-customWhite leading-tight focus:outline-none focus:shadow-outline ${
					isInvalid && 'border-customYellow text-customYellow'
				}`}
			/>
			{isInvalid && errorMessage && (
				<p className="block text-sm text-customYellow">
					{errorMessage}
				</p>
			)}
		</div>
	);
};

export default Input;
