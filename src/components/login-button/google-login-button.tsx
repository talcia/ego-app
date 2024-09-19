import google from '../../../assets/svg/google.svg';
import Image from 'next/image';

interface GoogleLoginButtonProps {
	onClick: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onClick }) => {
	return (
		<Image
			alt="google"
			src={google}
			width={40}
			height={40}
			className="size-10 cursor-pointer"
			onClick={onClick}
		/>
	);
};

export default GoogleLoginButton;
