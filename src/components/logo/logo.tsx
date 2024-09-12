import { Zhi_Mang_Xing } from 'next/font/google';
import { useRouter } from 'next/router';

const zhiMangXing = Zhi_Mang_Xing({ weight: '400', subsets: ['latin'] });

interface LogoProps {
	variant?: 'normal' | 'small';
	clickable?: boolean;
}

const Logo: React.FC<LogoProps> = ({
	variant = 'normal',
	clickable = true,
}) => {
	const router = useRouter();

	const handleLogoClick = () => {
		router.replace('/profile');
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
