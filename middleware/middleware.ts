import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const authSession = request.cookies.get('auth_session')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  
  const isPublicRoute = path === '/login' || path === '/registration' || path === '/';

  if (!authSession && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authSession && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (authSession && userRole) {
    
    if (path.startsWith('/admin') && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (path.startsWith('/hr') && userRole !== 'HR' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    const isManagement = 
      userRole === 'CHIEF_AGRICULTURIST' || 
      userRole === 'CHIEF_ADMINISTRATIVE' || 
      userRole === 'REGIONAL_EXECUTIVE' ||
      userRole === 'APCO' ||
      userRole === 'ADMIN';

    if (path.startsWith('/approvals') && !isManagement) {
      return NextResponse.redirect(new URL('/dashboard', request.url)); // STAFF gets kicked out
    }
    
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};