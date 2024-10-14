import { useSession as useSessionAuth } from 'next-auth/react';

export const useSession = () => {
	const { data } = useSessionAuth({
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

	return data?.user;
};
