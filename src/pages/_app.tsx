import type { AppProps } from 'next/app';
import Layout from '@/components/layout/layout';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import { PlayerContextProvider } from '@/store/player-context';
import { RoundContextProvider } from '@/store/round-context';

import '@/styles/globals.css';

export type NextPageWithLayout<P = {}> = NextPage<P> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout || ((page) => <>{page}</>);
	return (
		<PlayerContextProvider>
			<RoundContextProvider>
				<Layout>{getLayout(<Component {...pageProps} />)}</Layout>
			</RoundContextProvider>
		</PlayerContextProvider>
	);
}
