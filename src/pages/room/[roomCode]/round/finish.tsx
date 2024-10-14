import Button from '@/components/button/button';
import PlayersResults from '@/components/players-list/players-results';
import { PlayerInLobby } from '@/types/room-types';
import { getPlayers } from '@/utils/api/players';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface FinishPageProps {
	players: PlayerInLobby[];
}

const FinishPage: React.FC<FinishPageProps> = ({ players }) => {
	const router = useRouter();
	const {
		query: { roomCode },
	} = router;
	const [isLoading, setIsLoading] = useState(false);

	const onBackToLobbyClick = async () => {
		setIsLoading(true);
		const response = await fetch(`/api/room/${roomCode}/lobby`, {
			method: 'POST',
		});
		if (response.status === 200) {
			router.replace(`/room/${roomCode}/lobby`);
		}
		setIsLoading(false);
	};

	return (
		<div className="flex flex-col my-3">
			<h1 className="text-customWhite text-center text-2xl mb-5">
				Results
			</h1>
			<div>
				<PlayersResults players={players} />
			</div>

			<Button onClick={onBackToLobbyClick} isLoading={isLoading}>
				Back to Lobby
			</Button>
		</div>
	);
};

export default FinishPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { roomCode } = context.params!;

	const players = await getPlayers(roomCode as string);

	return {
		props: {
			players,
		},
	};
};
