import { auth } from '@/utils/db/firebase';
import { Zhi_Mang_Xing } from 'next/font/google';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

const zhiMangXing = Zhi_Mang_Xing({ weight: '400', subsets: ['latin'] });

const Logo: React.FC = () => {
	const [user] = useAuthState(auth);
	const router = useRouter();

	const handleLogoClick = () => {
		if (!user) {
			router.replace('/');
		} else {
			router.replace('/profile');
		}
	};

	return (
		<p
			className={`${zhiMangXing.className} text-9xl text-customRed my-10 cursor-pointer text-center`}
			onClick={handleLogoClick}
		>
			ego
		</p>
	);
};
``;
export default Logo;
