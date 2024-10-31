import { storage } from '@/utils/db/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface PlayerAvatar {
	playerId?: string;
	name?: string;
	size?: number;
	className?: string;
	playerCoin?: number;
}

const PlayerAvatar: React.FC<PlayerAvatar> = ({
	name,
	size = 150,
	playerCoin,
	className,
	playerId,
}) => {
	const [photoURL, setPhotoURL] = useState('');

	useEffect(() => {
		const getPhoto = async () => {
			try {
				const fileRef = ref(storage, `images/${playerId}`);
				const fileURL = await getDownloadURL(fileRef);
				setPhotoURL(fileURL);
			} catch (e) {
				const fileRef = ref(storage, `images/unknown.png`);
				const fileURL = await getDownloadURL(fileRef);
				setPhotoURL(fileURL);
			}
		};
		if (playerId) {
			getPhoto();
		}
	}, [playerId]);

	if (!photoURL) {
		return (
			<div
				className={`flex justify-center ${className} h-[${size}px]`}
			></div>
		);
	}

	return (
		<>
			<div className={`flex justify-center ${className} h-[${size}px]`}>
				<div
					className={`relative rounded-full overflow-hidden`}
					style={{ width: size, height: size }}
				>
					<Image
						src={photoURL}
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
