import { auth } from '@/utils/db/firebase';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

const useAuth = () => {
	const [user] = useAuthState(auth);
	const router = useRouter();

	if (!user) {
		router.push('/auth');
	}
};

export default useAuth;
