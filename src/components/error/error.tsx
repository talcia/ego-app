interface ErrorProps {
	errorMessage: string;
}

const Error: React.FC<ErrorProps> = ({ errorMessage = 'An Error occured' }) => {
	return (
		<p className="text-center mx-auto max-w-[200px] text-[#FFD700] break-words bg-opacity-50 p-2 rounded-lg">
			{errorMessage}
		</p>
	);
};

export default Error;
