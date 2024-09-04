interface PlayerAvatar {
	name: string;
	photoUrl: string;
}

const PlayerAvatar: React.FC<PlayerAvatar> = ({ name, photoUrl }) => {
	return (
		<div className="flex flex-col justify-center items-center">
			<p className="rounded-full size-20 bg-white"></p>
			<p className="white-text my-2">{name}</p>
		</div>
	);
};

export default PlayerAvatar;
