import { User } from '@/types/user-types';
import PlayerAvatar from '../question-page/player-avatar';
import { PlayerInLobby } from '@/types/room-types';
interface PlayersAvatarListProps {
	players: PlayerInLobby[];
	user: User;
}

const PlayersAvatarList: React.FC<PlayersAvatarListProps> = ({
	players,
	user,
}) => {
	const updatedPlayers = players.filter((player) => player.id !== user.id);

	return (
		<ul className="flex justify-center">
			{updatedPlayers.map((player) => (
				<li key={player.id}>
					<PlayerAvatar
						size={40}
						className={
							player.isReady ? 'border-4 border-green-600' : ''
						}
						playerId={player.id}
					/>
				</li>
			))}
		</ul>
	);
};

export default PlayersAvatarList;
