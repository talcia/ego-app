import { createContext, useState } from 'react';

const RoundContext = createContext({
	numberOfRounds: 3,
	setNumberOfRounds: (value: number) => {},
	maxRounds: 10,
	setMaxRounds: (value: number) => {},
});

export function RoundContextProvider(props: { children: React.ReactNode }) {
	const [numberOfRounds, setNumberOfRounds] = useState(3);
	const [maxRounds, setMaxRounds] = useState(10);

	return (
		<RoundContext.Provider
			value={{
				numberOfRounds,
				setNumberOfRounds,
				maxRounds,
				setMaxRounds,
			}}
		>
			{props.children}
		</RoundContext.Provider>
	);
}

export default RoundContext;
