import Button from '@/components/button/button';
import Logo from '@/components/logo/logo';
import useAuth from '@/hooks/use-auth';
import { auth } from '@/utils/db/firebase';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

const Profile: React.FC = () => {
	useAuth();
	const router = useRouter();
	const [user] = useAuthState(auth);

	const handleCreateRoom = () => {
		router.push('/room/create');
	};

	const handleJoinRoom = () => {
		router.push('/room/join');
	};

	return (
		<>
			<Logo />
			<div className="flex flex-col">
				<p className="white-text text-center mb-10">
					{user?.displayName || user?.email}
				</p>
				<Button onClick={handleCreateRoom}>Create room</Button>
				<Button onClick={handleJoinRoom}>Join room</Button>
			</div>
		</>
	);
};

export default Profile;
