import Button from '@/components/button/button';
import useAuth from '@/hooks/use-auth';
import { auth } from '@/utils/db/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import PlayerAvatar from '@/components/question-page/player-avatar';
import ProfileLayout from './layout';
import { NextPageWithLayout } from '../_app';

const Profile: NextPageWithLayout = () => {
	useAuth();
	const [user] = useAuthState(auth);

	return (
		<div className="flex flex-col ">
			<div className="my-3">
				<PlayerAvatar name="" size={150} playerId={user?.uid!} />
			</div>
			<div className="flex justify-center items-center my-5">
				<p className="text-customWhite text-center ">
					{user?.displayName || user?.email}
				</p>
			</div>
			<Link href="/room/create">
				<Button>Create room</Button>
			</Link>
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
