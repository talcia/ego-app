import { createContext, useState } from 'react';

const AdminContext = createContext({
	isAdmin: false,
	setIsAdmin: (value: boolean) => {},
});

export function AdminContextProvider(props: { children: React.ReactNode }) {
	const [isAdmin, setIsAdmin] = useState(false);

	return (
		<AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
			{props.children}
		</AdminContext.Provider>
	);
}

export default AdminContext;
