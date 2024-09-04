import { auth } from '@/utils/db/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

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
					<p
						className={`rounded-full size-10 bg-white ${
							player.isReady ? 'border-4 border-green-600' : ''
						}`}
					></p>
				</li>
			))}
		</ul>
	);
};

export default PlayersAvatarList;
