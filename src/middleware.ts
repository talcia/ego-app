import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (
		pathname.startsWith('/api') ||
		pathname.startsWith('/guest') ||
		pathname.startsWith('/auth') ||
		pathname === '/' ||
		pathname === '/favicon.ico' ||
		pathname.startsWith('/_')
	) {
		return NextResponse.next();
	}
	const token = await getToken({ req });

	if (!token) {
		return NextResponse.redirect(new URL('/', req.url));
	}
	return NextResponse.next();
}
