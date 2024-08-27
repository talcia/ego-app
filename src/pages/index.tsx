import Button from '@/components/button/button';
import Logo from '@/components/logo/logo';
import Link from 'next/link';

const HomePage = () => {
	return (
		<>
			<Logo />
			<div className="flex flex-col items-center">
				<Button variant="white">
					<Link href="/auth">Login</Link>
				</Button>
				<Button variant="white">
					<Link href="/guest">Play as guest</Link>
				</Button>
			</div>
		</>
	);
};

export default HomePage;
