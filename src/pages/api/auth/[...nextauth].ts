import { auth } from '@/utils/db/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {},
			authorize: async (credentials): Promise<any> => {
				try {
					const { user } = await signInWithEmailAndPassword(
						auth,
						(credentials as any).email || '',
						(credentials as any).password || ''
					);
					if (user) {
						return {
							id: user.uid,
							email: user.email,
							name: user.displayName,
						};
					}
					return null;
				} catch (error) {
					console.error('Login failed:', error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }: { token: JWT; user?: User }) {
			if (user) {
				token.id = user.id;
				token.name = user.name;
			}
			return token;
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			if (session.user) {
				session.user.id = token.id as string;
			}
			return session;
		},
	},
};

export default NextAuth(authOptions);
