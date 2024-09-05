'use client';
import Button from '@/components/button/button';
import Error from '@/components/error/error';
import Input from '@/components/input/input';
import Logo from '@/components/logo/logo';
import { auth } from '@/utils/db/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useState } from 'react';

const SignUpPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [checkError, setCheckError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const router = useRouter();

	const handleSubmit = async () => {
		!checkError && setCheckError(true);
		if (
			email.includes('@') &&
			password.trim().length >= 8 &&
			password === confirmPassword
		) {
			try {
				await createUserWithEmailAndPassword(auth, email, password);
				router.push('/auth');
				setEmail('');
				setPassword('');
				setConfirmPassword('');
			} catch (e) {
				setErrorMessage('An error occurred. Please try again.');
			}
		}
	};

	return (
		<>
			<Logo />
			<div>
				{errorMessage && <Error errorMessage={errorMessage} />}
				<Input
					label="Email"
					value={email}
					onChange={({ target: { value } }) => setEmail(value)}
					isInvalid={checkError && !email.includes('@')}
					errorMessage="Email is invalid"
				/>
				<Input
					label="Password"
					type="password"
					value={password}
					onChange={({ target: { value } }) => setPassword(value)}
					isInvalid={checkError && password.trim().length < 8}
					errorMessage="Password is too short"
				/>
				<Input
					label="Confirm Password"
					type="password"
					value={confirmPassword}
					onChange={({ target: { value } }) =>
						setConfirmPassword(value)
					}
					isInvalid={checkError && password !== confirmPassword}
					errorMessage="Password not match"
				/>
				<Button onClick={handleSubmit}>Sign Up</Button>
			</div>
		</>
	);
};

export default SignUpPage;
