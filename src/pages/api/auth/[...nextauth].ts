import { auth } from '@/utils/db/firebase';
import { signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: 'credentials',
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
					console.error('Login failed: 1', error);
					return null;
				}
			},
		}),
		CredentialsProvider({
			id: 'anonymously',
			name: 'Anonymously',
			credentials: {},
			authorize: async (): Promise<any> => {
				try {
					const user = await signInAnonymously(auth);
					if (user.user) {
						return {
							id: user.user.uid,
							name: 'Guest',
						};
					}
				} catch (error) {
					console.error('Login failed: 2', error);
					return null;
				}
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID!,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
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
