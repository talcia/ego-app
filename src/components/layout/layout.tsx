interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className="container flex flex-col items-center mx-auto px-10 py-10">
			{children}
		</div>
	);
};

export default Layout;
