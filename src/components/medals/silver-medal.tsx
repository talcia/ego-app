import Image from 'next/image';
import silverMedal from '../../../assets/svg/silver-medal.svg';

const SilverMedal: React.FC = () => {
	return <Image src={silverMedal} width={40} height={40} alt="gold medal" />;
};

export default SilverMedal;
