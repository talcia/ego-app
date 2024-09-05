import Image from 'next/image';
import goldMedal from '../../../assets/svg/gold-medal.svg';

const GoldMedal: React.FC = () => {
	return <Image src={goldMedal} width={40} height={40} alt="gold medal" />;
};

export default GoldMedal;
