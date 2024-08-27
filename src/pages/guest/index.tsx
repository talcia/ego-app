import Button from '@/components/button/button';
import Input from '@/components/input/input';
import Logo from '@/components/logo/logo';

const GuestPage = () => {
	return (
		<>
			<Logo />
			<div>
				<Input label="Room Code" />
				<Button>Next</Button>
			</div>
		</>
	);
};

export default GuestPage;
