import type { AppProps } from 'next/app';
import Layout from '@/components/layout/layout';
import '@/styles/globals.css';
import { AdminContextProvider } from '@/store/admin-context';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AdminContextProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</AdminContextProvider>
	);
}
