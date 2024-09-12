import SessionProvider from '@/store/session-provider';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<SessionProvider>
			<div
				className={`container flex flex-col items-center mx-auto h-full`}
			>
				{children}
			</div>
		</SessionProvider>
	);
};

export default Layout;
