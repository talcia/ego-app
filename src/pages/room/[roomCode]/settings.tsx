import Button from '@/components/button/button';
import { NextPageWithLayout } from '@/pages/_app';
import PlayerContext from '@/store/player-context';
import RoundContext from '@/store/round-context';
import { db } from '@/utils/db/firebase';
import { doc, getDoc } from 'firebase/firestore';

import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import Logo from '@/components/logo/logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Input from '@/components/input/input';
import { GetServerSideProps } from 'next';
import { getRoomData } from '@/utils/api/rooms';

const RoomSettings: NextPageWithLayout<{
	initialPoints: number;
	numberOfRounds: number;
}> = ({ initialPoints, numberOfRounds }) => {
	const router = useRouter();
	const {
		query: { roomCode },
	} = router;
	const { isAdmin, setPoints: setInitialPoints } = useContext(PlayerContext);
	const { setNumberOfRounds, maxRounds } = useContext(RoundContext);
	const [points, setPoints] = useState(initialPoints);
	const [rounds, setRounds] = useState(numberOfRounds);
	const [isLoading, setIsLoading] = useState(false);

	if (!isAdmin) {
		router.replace('/');
		return;
	}

	const onBackIconClick = () => {
		router.back();
	};

	const onSaveClick = async () => {
		setIsLoading(true);
		const response = await fetch(`/api/room/${roomCode}`, {
			method: 'POST',
			body: JSON.stringify({
				rounds,
				points,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (response.status === 201) {
			setInitialPoints(points);
			setNumberOfRounds(rounds);
			router.replace(`/room/${roomCode}/lobby`);
		}
		setIsLoading(false);
	};

	return (
		<div className="flex flex-col">
			<div className="w-full flex items-center justify-between  text-customWhite">
				<FontAwesomeIcon
					icon={faArrowLeft}
					onClick={onBackIconClick}
					className="cursor-pointer"
				/>
				<Logo variant="small" />
			</div>
			<h1 className="text-customWhite text-center text-2xl mb-5">
				{roomCode}
			</h1>
			<Input
				label="How many rounds?"
				type="number"
				value={rounds}
				max={maxRounds}
				onChange={({ target: { value } }) => setRounds(+value)}
			/>
			<Input
				label="Player initial points"
				type="number"
				value={points}
				max={10}
				onChange={({ target: { value } }) => setPoints(+value)}
			/>
			<Button onClick={onSaveClick} isLoading={isLoading}>
				Save settings
			</Button>
		</div>
	);
};

export default RoomSettings;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { roomCode } = context.params!;

	const roomData = await getRoomData(roomCode as string);

	const { initialPoints, numberOfRounds } = roomData || {};

	return {
		props: {
			initialPoints,
			numberOfRounds,
		},
	};
};
