import Logo from '@/components/logo/logo';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';

interface LayoutProps {
	children: React.ReactNode;
}

const ProfileLayout: React.FC<LayoutProps> = ({ children }) => {
	const router = useRouter();

	const gearIconClick = () => {
		if (router.pathname === '/profile') {
			router.push('/profile/update');
		} else {
			router.push('/profile');
		}
	};
	return (
		<div className="w-[240px]">
			<div className="w-full flex items-center justify-between  text-customWhite">
				<Logo variant="small" />
				<FontAwesomeIcon icon={faGear} onClick={gearIconClick} />
			</div>
			{children}
		</div>
	);
};

export default ProfileLayout;
