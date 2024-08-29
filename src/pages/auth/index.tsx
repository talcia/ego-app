import Button from '@/components/button/button';
import Error from '@/components/error/error';
import Input from '@/components/input/input';
import FacebookLoginButton from '@/components/login-button/facebook-login-button';
import GoogleLoginButton from '@/components/login-button/google-login-button';
import Logo from '@/components/logo/logo';
import { auth } from '@/utils/db/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const LoginPage = () => {
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const router = useRouter();

	const handleLogin = async () => {
		try {
			await signInWithEmailAndPassword(auth, login, password);
			router.push('/profile');
		} catch (e) {
			setErrorMessage('An error occured. Please try again');
		}
	};

	return (
		<>
			<Logo />
			<div className="flex flex-col">
				<Error errorMessage={errorMessage} />
				<Input
					label="Login"
					value={login}
					onChange={({ target: { value } }) => setLogin(value)}
				/>
				<Input
					label="Password"
					type="password"
					value={password}
					onChange={({ target: { value } }) => setPassword(value)}
				/>
				<Button onClick={handleLogin}>Login</Button>
				<p className="block text-sm mb-2 white-text self-center">
					<Link href="/auth/reset-password">forget password?</Link>
				</p>
			</div>
			<div className="my-4 flex gap-10">
				<GoogleLoginButton />
				<FacebookLoginButton />
			</div>
			<div>
				<p className="block text-sm mb-2 white-text">
					<Link href="/auth/sign-up"> Dont have a account?</Link>
				</p>
			</div>
		</>
	);
};

export default LoginPage;
