import type { AppProps } from 'next/app';
import Layout from '@/components/layout/layout';
import { PlayerContextProvider } from '@/store/player-context';
import { RoundContextProvider } from '@/store/round-context';

import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<PlayerContextProvider>
			<RoundContextProvider>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</RoundContextProvider>
		</PlayerContextProvider>
	);
}
