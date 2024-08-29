interface ActionButtonProps {
	onDeclineClick?: () => void;
	onAcceptClick?: () => void;
}

const ActionButtons: React.FC<ActionButtonProps> = ({
	onDeclineClick,
	onAcceptClick,
}) => {
	return (
		<div className="ml-3 my-0 flex ">
			<button
				onClick={onDeclineClick}
				className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-1 rounded mx-1"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
			<button
				onClick={onAcceptClick}
				className="bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-1 rounded"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</button>
		</div>
	);
};

export default ActionButtons;
