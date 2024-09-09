import Button from '@/components/button/button';
import Logo from '@/components/logo/logo';
import Link from 'next/link';

const HomePage = () => {
	return (
		<>
			<Logo />
			<div className="flex flex-col items-center">
				<Link href="/auth">
					<Button variant="customWhite">Login</Button>
				</Link>
				<Link href="/guest">
					<Button variant="customWhite">Play as guest</Button>
				</Link>
			</div>
		</>
	);
};

export default HomePage;
