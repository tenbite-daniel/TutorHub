import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user is on auth pages
  if (pathname.startsWith('/auth/')) {
    // Get user data from localStorage (we'll check via cookie or header)
    const userCookie = request.cookies.get('user');
    
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie.value);
        
        // Redirect to appropriate dashboard based on role
        if (user.role === 'student') {
          return NextResponse.redirect(new URL('/dashboard/student', request.url));
        } else if (user.role === 'tutor') {
          return NextResponse.redirect(new URL('/dashboard/tutor', request.url));
        } else if (user.role === 'admin') {
          return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        } else {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch (error) {
        // Invalid cookie, continue to auth page
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*']
};