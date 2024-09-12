import { GetServerSidePropsContext, PreviewData } from 'next';
import { getSession } from 'next-auth/react';
import { ParsedUrlQuery } from 'querystring';

export const getSessionUser = async (
	context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
	const session = await getSession({ req: context.req });

	if (!session?.user) {
		return {
			redirect: {
				destination: '/auth',
				permanent: false,
			},
		};
	}

	return {
		props: {
			user: session.user,
		},
	};
};
