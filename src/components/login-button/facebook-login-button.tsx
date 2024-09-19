import Image from 'next/image';
import facebook from '../../../assets/svg/facebook.svg';

interface FacebookLoginButtonProps {
	onClick: () => void;
}

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({
	onClick,
}) => {
	return (
		<Image
			alt="facebook"
			src={facebook}
			width={40}
			height={40}
			className="size-10 cursor-pointer"
			onClick={onClick}
		/>
	);
};

export default FacebookLoginButton;
