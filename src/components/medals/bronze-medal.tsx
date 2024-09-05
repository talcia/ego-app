import Image from 'next/image';
import bronzeMedal from '../../../assets/svg/bronze-medal.svg';

const BronzeMedal: React.FC = () => {
	return <Image src={bronzeMedal} alt="gold medal" width={40} height={40} />;
};

export default BronzeMedal;
