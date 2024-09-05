import type { AppProps } from 'next/app';
import Layout from '@/components/layout/layout';
import '@/styles/globals.css';
import { AdminContextProvider } from '@/store/admin-context';
import { RoundContextProvider } from '@/store/round-context';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AdminContextProvider>
			<RoundContextProvider>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</RoundContextProvider>
		</AdminContextProvider>
	);
}
