import { createContext, useState } from 'react';

const RoundContext = createContext({
	numberOfRounds: 0,
	setNumberOfRounds: (value: number) => {},
});

export function RoundContextProvider(props: { children: React.ReactNode }) {
	const [numberOfRounds, setNumberOfRounds] = useState(0);

	return (
		<RoundContext.Provider
			value={{
				numberOfRounds,
				setNumberOfRounds,
			}}
		>
			{props.children}
		</RoundContext.Provider>
	);
}

export default RoundContext;
