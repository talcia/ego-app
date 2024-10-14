import { Dispatch, SetStateAction } from 'react';
import Button from '../button/button';
import { Answer } from '@/types/round-types';

interface AnswersListProps {
	answers: Answer[];
	selectedAnswer: string | undefined;
	setSelectedAnswer: Dispatch<SetStateAction<string>>;
}

const AnswersList: React.FC<AnswersListProps> = ({
	answers,
	selectedAnswer,
	setSelectedAnswer,
}) => {
	return (
		<ul>
			{answers.map((answer) => (
				<li key={answer.id}>
					<Button
						variant={
							selectedAnswer === answer.id
								? 'customRed'
								: 'customWhite'
						}
						font="normal"
						onClick={() => setSelectedAnswer(answer.id)}
					>
						{answer.label}
					</Button>
				</li>
			))}
		</ul>
	);
};

export default AnswersList;
