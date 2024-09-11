interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className={`container flex flex-col items-center mx-auto h-full`}>
			{children}
		</div>
	);
};

export default Layout;
