import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PlayerAvatar from '../question-page/player-avatar';
import ActionButtons from './action-buttons';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { PlayerInLobby } from '@/types/room-types';
interface PlayerListProps {
	players: PlayerInLobby[];
	isWaitingList: boolean;
	onDeclineClick?: (userId: string) => void;
	onAcceptClick?: (userId: string) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({
	players,
	isWaitingList = true,
	onAcceptClick,
	onDeclineClick,
}) => {
	return (
		<ul className="my-5">
			{players.map((player) => (
				<li
					key={player.id}
					className="flex flex-row my-2 items-center justify-between border-b-2 border-gray-500 pb-2"
				>
					<div className="flex items-center">
						<PlayerAvatar
							size={60}
							playerId={player.id}
							className="mr-2"
						/>
						<p
							className={`h-fit ${
								player.isReady
									? 'text-[green]'
									: 'text-customWhite'
							}`}
						>
							{player.name}
						</p>
						{player.admin && (
							<FontAwesomeIcon
								icon={faCrown}
								className="ml-5"
								style={{ color: 'yellow' }}
							/>
						)}
					</div>
					{isWaitingList && (
						<ActionButtons
							onAcceptClick={() => onAcceptClick?.(player.id)}
							onDeclineClick={() => onDeclineClick?.(player.id)}
						/>
					)}
				</li>
			))}
		</ul>
	);
};

export default PlayerList;
