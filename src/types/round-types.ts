export interface Answer {
	id: string;
	label: string;
	isChecked: boolean;
}

export interface PlayerAnswer {
	answer: string;
	coin: number;
	id: string;
	isReady: boolean;
	isReadyForNextRound: boolean;
	isEliminated: boolean;
}

export interface EliminatedPlayer {
	id: string;
	name: string;
}
