import { auth } from '@/utils/db/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import PlayerAvatar from '../question-page/player-avatar';

interface Player {
	id: string;
	avatar: string;
	isReady: boolean;
}

interface PlayersAvatarListProps {
	players: Player[];
}

const PlayersAvatarList: React.FC<PlayersAvatarListProps> = ({ players }) => {
	const [user] = useAuthState(auth);

	const updatedPlayers = players.filter((player) => player.id !== user?.uid);

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
