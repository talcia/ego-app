import SessionProvider from '@/store/session-provider';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<SessionProvider>
			<div
				className={`container flex flex-col items-center mx-auto h-full max-w-sm py-10`}
			>
				{children}
			</div>
		</SessionProvider>
	);
};

export default Layout;
