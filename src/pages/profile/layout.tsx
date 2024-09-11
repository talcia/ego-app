import Logo from '@/components/logo/logo';
import PlayerContext from '@/store/player-context';
import { auth } from '@/utils/db/firebase';
import { faGear, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useContext } from 'react';

interface LayoutProps {
	children: React.ReactNode;
}

const ProfileLayout: React.FC<LayoutProps> = ({ children }) => {
	const router = useRouter();
	const { setIsAdmin } = useContext(PlayerContext);

	const gearIconClick = () => {
		if (router.pathname === '/profile') {
			router.push('/profile/update');
		} else {
			router.push('/profile');
		}
	};

	const onLogoutIconClick = async () => {
		await signOut(auth);
		router.replace('/auth');
		setIsAdmin(false);
	};

	return (
		<div className="w-[240px]">
			<div className="w-full flex items-center justify-between  text-customWhite">
				<Logo variant="small" />
				<div className="flex gap-4">
					<FontAwesomeIcon
						icon={faSignOut}
						onClick={onLogoutIconClick}
						className="cursor-pointer"
					/>
					<FontAwesomeIcon
						icon={faGear}
						onClick={gearIconClick}
						className="cursor-pointer"
					/>
				</div>
			</div>
			{children}
		</div>
	);
};

export default ProfileLayout;
