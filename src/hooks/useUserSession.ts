import { useSession } from 'next-auth/react';

export const useUserSession = () => {
	const { data } = useSession({
		required: true,
		onUnauthenticated() {
			return {
				redirect: {
					destination: '/auth',
					permanent: false,
				},
			};
		},
	});

	return data?.user || {};
};
