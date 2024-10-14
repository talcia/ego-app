import Button from '@/components/button/button';
import Link from 'next/link';
import PlayerAvatar from '@/components/question-page/player-avatar';
import ProfileLayout from './layout';
import { NextPageWithLayout } from '../_app';
import { useUserSession } from '@/hooks/useUserSession';

const Profile: NextPageWithLayout = () => {
	const { id, name, email } = useUserSession();

	return (
		<div className="flex flex-col ">
			<div className="my-3">
				<PlayerAvatar name="" size={150} playerId={id} />
			</div>
			<div className="flex justify-center items-center my-5">
				<p className="text-customWhite text-center ">{name || email}</p>
			</div>
			{email && (
				<Link href="/room/create">
					<Button>Create room</Button>
				</Link>
			)}
			<Link href="/room/join">
				<Button>Join room</Button>
			</Link>
		</div>
	);
};

Profile.getLayout = (page: React.ReactElement) => (
	<ProfileLayout>{page}</ProfileLayout>
);

export default Profile;
