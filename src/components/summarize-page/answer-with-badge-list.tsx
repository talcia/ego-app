import { Answer, PlayerAnswer } from '@/types/round-types';
import Button from '../button/button';
import PlayerAvatar from '../player-avatar/player-avatar';

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
									<PlayerAvatar
										key={player.id}
										playerId={player.id}
										playerCoin={player.coin}
										size={50}
									/>
								)
						)}
					</div>
				</li>
			))}
		</ul>
	);
};

export default AnswersList;
