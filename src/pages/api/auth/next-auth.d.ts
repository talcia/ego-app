import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: {
			id?: string;
			displayName?: string;
			photoUrl?: string;
		} & DefaultSession['user'];
	}

	interface User extends DefaultUser {
		id?: string;
		displayName?: string;
		photoUrl?: string;
	}
}
