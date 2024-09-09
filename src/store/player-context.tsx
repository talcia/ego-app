import { createContext, useState } from 'react';

const PlayerContext = createContext({
	isAdmin: false,
	setIsAdmin: (value: boolean) => {},
	points: 10,
	setPoints: (value: number) => {},
	isEliminated: false,
	setIsEliminated: (value: boolean) => {},
});

export function PlayerContextProvider(props: { children: React.ReactNode }) {
	const [isAdmin, setIsAdmin] = useState(false);
	const [points, setPoints] = useState(10);
	const [isEliminated, setIsEliminated] = useState(false);

	return (
		<PlayerContext.Provider
			value={{
				isAdmin,
				setIsAdmin,
				points,
				setPoints,
				isEliminated,
				setIsEliminated,
			}}
		>
			{props.children}
		</PlayerContext.Provider>
	);
}

export default PlayerContext;
