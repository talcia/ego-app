import { auth } from '@/utils/db/firebase';
import { Zhi_Mang_Xing } from 'next/font/google';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

const zhiMangXing = Zhi_Mang_Xing({ weight: '400', subsets: ['latin'] });

interface LogoProps {
	variant?: 'normal' | 'small';
	clickable?: boolean;
}

const Logo: React.FC<LogoProps> = ({
	variant = 'normal',
	clickable = true,
}) => {
	const [user] = useAuthState(auth);
	const router = useRouter();

	const handleLogoClick = () => {
		if (!user) {
			router.replace('/');
		} else {
			router.replace('/profile');
		}
	};

	const style = {
		small: 'text-5xl mb-4',
		normal: 'text-9xl my-10 text-center',
	};

	return (
		<p
			className={`${zhiMangXing.className} text-customRed ${
				clickable && 'cursor-pointer'
			} ${style[variant]}`}
			onClick={clickable ? handleLogoClick : undefined}
		>
			ego
		</p>
	);
};
``;
export default Logo;
