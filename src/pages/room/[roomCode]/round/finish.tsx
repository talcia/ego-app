import Button from '@/components/button/button';
import PlayersResults, {
	Player,
} from '@/components/players-list/players-results';
import { getPlayers } from '@/utils/api/players';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

interface FinishPageProps {
	players: Player[];
}

const FinishPage: React.FC<FinishPageProps> = ({ players }) => {
	const router = useRouter();
	const {
		query: { roomCode },
	} = router;

	const onBackToLobbyClick = async () => {
		const response = await fetch(`/api/room/${roomCode}/lobby`, {
			method: 'POST',
		});
		if (response.status === 200) {
			router.replace(`/room/${roomCode}/lobby`);
		}
	};

	return (
		<div className="flex flex-col my-3">
			<h1 className="text-customWhite text-center text-2xl mb-5">
				Results
			</h1>
			<div>
				<PlayersResults players={players} />
			</div>

			<Button onClick={onBackToLobbyClick}>Back to Lobby</Button>
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
