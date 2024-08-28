import Button from '@/components/button/button';
import Input from '@/components/input/input';
import Logo from '@/components/logo/logo';
import { useState } from 'react';

const SignUpPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleSubmit = () => {
		console.log('submit');
	};

	return (
		<>
			<Logo />
			<div>
				<Input
					label="Email"
					value={email}
					onChange={({ target: { value } }) => setEmail(value)}
				/>
				<Input
					label="Password"
					type="password"
					value={password}
					onChange={({ target: { value } }) => setPassword(value)}
				/>
				<Input
					label="Confirm Password"
					type="password"
					value={confirmPassword}
					onChange={({ target: { value } }) =>
						setConfirmPassword(value)
					}
				/>
				<Button onClick={handleSubmit}>Sign Up</Button>
			</div>
		</>
	);
};

export default SignUpPage;
