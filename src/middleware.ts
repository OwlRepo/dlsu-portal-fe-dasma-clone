import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the user cookie exists
  const userCookie = request.cookies.get('user');

  // Define the protected routes
  const protectedRoutes = ['/', '/reports', '/user-management', '/settings'];

  // If the user cookie does not exist and the request is for the /dashboard route
  if (!userCookie && protectedRoutes.includes(request.nextUrl.pathname)) {
    // Redirect to the /login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (userCookie && request.nextUrl.pathname === '/login') {
    // Redirect to the dashboard page
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Specify the paths where the middleware should run
export const config = {
  matcher: ['/', '/reports', '/user-management', '/settings', '/login'],
};
