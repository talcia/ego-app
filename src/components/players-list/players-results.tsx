import BronzeMedal from '../medals/bronze-medal';
import GoldMedal from '../medals/gold-medal';
import SilverMedal from '../medals/silver-medal';
import PlayerAvatar from '../question-page/player-avatar';

export interface Player {
	id: string;
	name: string;
	avatar: string;
	admin: boolean;
	isReady: boolean;
	points: number;
}

interface PlayerListProps {
	players: Player[];
}

const PlayerResults: React.FC<PlayerListProps> = ({ players }) => {
	const sortedPlayers = players.sort((a, b) => b.points - a.points);
	return (
		<ul className="my-5">
			{sortedPlayers.map((player, index) => (
				<li
					key={player.id}
					className="flex flex-row justify-between gap-5 my-6 items-center border-b-2 border-gray-500 pb-4"
				>
					{index + 1 === 1 && <GoldMedal />}
					{index + 1 === 2 && <SilverMedal />}
					{index + 1 === 3 && <BronzeMedal />}
					{index + 1 > 3 && (
						<p className="font-bold text-customWhite w-[40px] text-center">
							{index + 1}.
						</p>
					)}
					<div className="flex items-center gap-2">
						<PlayerAvatar playerId={player.id} />
						<p className="h-fit text-customWhite">{player.name}</p>
					</div>
					<p className="font-bold text-white">
						{player.points} points
					</p>
				</li>
			))}
		</ul>
	);
};

export default PlayerResults;
