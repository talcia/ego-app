import Button from '../button/button';

export interface Answer {
	id: string;
	label: string;
}

interface PlayerAnswer {
	answer: string;
	coin: number;
	id: string;
}

interface AnswersListProps {
	answers: Answer[];
	correctAnswer: string;
	playersAnswers: PlayerAnswer[];
}

const AnswersList: React.FC<AnswersListProps> = ({
	answers,
	correctAnswer,
	playersAnswers,
}) => {
	return (
		<ul>
			{answers.map((answer) => (
				<li key={answer.id} className="relative">
					<Button
						variant={
							correctAnswer === answer.id
								? 'customRed'
								: 'customWhite'
						}
						font="normal"
					>
						{answer.label}
					</Button>
					<div className="flex absolute top-0 right-[-2rem]">
						{playersAnswers?.map(
							(player) =>
								player.answer === answer.id && (
									<p
										key={player.id}
										className="rounded-full size-10 bg-white mx-1 relative"
									>
										<p className="rounded-full size-5 bg-white mx-1 absolute top-[-6px] right-[-10px] flex justify-center items-center">
											{player.coin}
										</p>
									</p>
								)
						)}
					</div>
				</li>
			))}
		</ul>
	);
};

export default AnswersList;
