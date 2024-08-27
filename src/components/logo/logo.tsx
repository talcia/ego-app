import styles from './logo.module.scss';

const Logo: React.FC = () => {
	return (
		<div
			className={`flex items-center justify-center rounded-full size-40 mb-10 ${styles.logo}`}
		>
			<p className="text-3xl">ego</p>
		</div>
	);
};

export default Logo;
