import { NextResponse } from 'next/server';
import { auth } from './lib/auth';

export default auth((req) => {
  // Check if the user is authenticated and trying to access a protected route
  const isLoggedIn = !!req.auth?.user;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
    }
    return null;
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
  }

  return null;
});

// Optionally, specify which paths should be protected
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
