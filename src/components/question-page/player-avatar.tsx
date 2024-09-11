import Image from 'next/image';
import { useEffect, useState } from 'react';

interface PlayerAvatar {
	playerId: string;
	name?: string;
	size?: number;
	className?: string;
	playerCoin?: number;
}

const PlayerAvatar: React.FC<PlayerAvatar> = ({
	playerId,
	name,
	size = 150,
	playerCoin,
	className,
}) => {
	const [photoUrl, setPhotoUrl] = useState('');

	useEffect(() => {
		const getPhoto = async () => {
			const res = await fetch(`/api/storage?fileId=${playerId}`);
			const data = await res.json();
			setPhotoUrl(data.downloadURL);
		};

		getPhoto();
	});

	return (
		<>
			<div className={`flex justify-center ${className} h-[${size}px]`}>
				<div
					className={`relative rounded-full overflow-hidden`}
					style={{ width: size, height: size }}
				>
					<Image
						src={photoUrl}
						alt="user image"
						fill
						className="object-cover"
					/>
				</div>
				{playerCoin && (
					<p className="rounded-full size-5 bg-white mx-1 absolute top-[-6px] right-[-10px] flex justify-center items-center">
						{playerCoin}
					</p>
				)}
				{name && <p className="text-customWhite my-2">{name}</p>}
			</div>
		</>
	);
};

export default PlayerAvatar;
