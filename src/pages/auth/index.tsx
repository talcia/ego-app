import Button from '@/components/button/button';
import Error from '@/components/error/error';
import Input from '@/components/input/input';
import FacebookLoginButton from '@/components/login-button/facebook-login-button';
import GoogleLoginButton from '@/components/login-button/google-login-button';
import Logo from '@/components/logo/logo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/utils/db/firebase';

const LoginPage = () => {
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const session = useSession();

	useEffect(() => {
		if (session.status === 'authenticated') {
			router.push('/profile');
		}
	}, [router, session]);

	const handleLogin = async () => {
		setIsLoading(true);
		try {
			await signInWithEmailAndPassword(auth, login, password);
			signIn('credentials', {
				email: login,
				password,
				redirect: true,
				callbackUrl: '/profile',
			});
			router.push('/profile');
		} catch (e) {
			setErrorMessage('An error occured. Please try again');
		}
		setIsLoading(false);
	};

	const onGoogleLoginButtonClick = async () => {
		await signIn('google', { redirect: true, callbackUrl: '/profile' });
	};

	const onFacebookLoginButtonClick = async () => {
		await signIn('facebook', { redirect: true, callbackUrl: '/profile' });
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
				<Button onClick={handleLogin} isLoading={isLoading}>
					Login
				</Button>
				<p className="block text-sm mb-2 text-customWhite self-center">
					<Link href="/auth/reset-password">forget password?</Link>
				</p>
			</div>
			<div className="my-4 flex gap-10">
				<GoogleLoginButton onClick={onGoogleLoginButtonClick} />
				<FacebookLoginButton onClick={onFacebookLoginButtonClick} />
			</div>
			<div>
				<p className="block text-sm mb-2 text-customWhite">
					<Link href="/auth/sign-up"> Dont have a account?</Link>
				</p>
			</div>
		</>
	);
};

export default LoginPage;
