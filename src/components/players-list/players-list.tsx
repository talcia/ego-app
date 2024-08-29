import ActionButtons from './action-buttons';

interface Player {
	id: string;
	name: string;
	avatar: string;
	admin: boolean;
	isReady: boolean;
}

interface PlayerListProps {
	players: Player[];
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
					className="flex flex-row my-2 items-center border-b-2 border-gray-500 pb-2"
				>
					<p className="rounded-full size-10 bg-white mr-3"></p>
					<p
						className={`h-fit ${
							player.admin
								? 'text-[gold]'
								: player.isReady
								? 'text-[green]'
								: 'white-text'
						}`}
					>
						{player.name}
					</p>
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
