import { Dispatch, SetStateAction, useState } from 'react';

interface CoinProps {
	onCoinClick: Dispatch<SetStateAction<number>>;
	playerCoin: number;
}

const Coin: React.FC<CoinProps> = ({ onCoinClick, playerCoin }) => {
	const [isActive, setIsActive] = useState(false);

	const onClick = () => {
		if (isActive) {
			onCoinClick((prevValue) => {
				if (prevValue !== 1) {
					setIsActive(false);
					return prevValue - 1;
				}
				return prevValue;
			});
		} else {
			onCoinClick((prevValue) => {
				if (playerCoin === 1 && prevValue === 1) {
					return prevValue;
				}
				setIsActive(true);
				return prevValue + 1;
			});
		}
	};

	return (
		<div
			className={`flex items-center justify-center rounded-full w-16 h-16 ${
				isActive
					? 'bg-customRed text-customWhite'
					: 'bg-customWhite text-customBlack'
			}`}
			onClick={onClick}
		>
			<span className="font-bold">1</span>
		</div>
	);
};

export default Coin;
