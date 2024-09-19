import Button from '@/components/button/button';
import Input from '@/components/input/input';
import Logo from '@/components/logo/logo';
import Error from '@/components/error/error';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/utils/db/firebase';
import { useRouter } from 'next/router';

const ResetPasswordPage = () => {
	const [email, setEmail] = useState('');
	const [checkError, setCheckError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isEmailSent, setIsEmailSent] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const router = useRouter();

	const onResetPasswordClick = async () => {
		setIsLoading(true);
		!checkError && setCheckError(true);
		setErrorMessage('');
		if (email.includes('@')) {
			try {
				await sendPasswordResetEmail(auth, email);
				setIsEmailSent(true);
			} catch (e) {
				setErrorMessage('An error occurred. Please try again.');
				setCheckError(false);
			}
		}
		setIsLoading(false);
	};

	return (
		<div className="flex flex-col items-center">
			<Logo />
			{errorMessage && <Error errorMessage={errorMessage} />}
			{isEmailSent ? (
				<>
					<p className="text-customWhite my-3">Email sent</p>
					<Button
						onClick={() => {
							router.back();
						}}
					>
						Back
					</Button>
				</>
			) : (
				<>
					<Input
						label="Email"
						value={email}
						onChange={({ target: { value } }) => setEmail(value)}
						isInvalid={checkError && !email.includes('@')}
						errorMessage="Email is invalid"
					/>
					<Button
						onClick={onResetPasswordClick}
						isLoading={isLoading}
					>
						Send email
					</Button>
				</>
			)}
		</div>
	);
};

export default ResetPasswordPage;
