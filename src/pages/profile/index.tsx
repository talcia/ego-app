import Button from '@/components/button/button';
import Link from 'next/link';
import PlayerAvatar from '@/components/question-page/player-avatar';
import ProfileLayout from './layout';
import { NextPageWithLayout } from '../_app';
import { useSession } from 'next-auth/react';

const Profile: NextPageWithLayout = () => {
	const { data } = useSession();

	if (!data?.user) {
		return;
	}

	const { user } = data;

	return (
		<div className="flex flex-col ">
			<div className="my-3">
				<PlayerAvatar name="" size={150} playerId={user.id!} />
			</div>
			<div className="flex justify-center items-center my-5">
				<p className="text-customWhite text-center ">
					{user.name || user.email}
				</p>
			</div>
			{user.email && (
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
