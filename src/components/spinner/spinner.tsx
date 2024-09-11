interface SpinnerProps {
	color?: string;
	size?: number;
}

const Spinner: React.FC<SpinnerProps> = ({
	color = 'customWhite',
	size = 8,
}) => (
	<div
		className={`inline-block text-${color} h-${size} w-${size} animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]`}
		role="status"
	></div>
);

export default Spinner;
