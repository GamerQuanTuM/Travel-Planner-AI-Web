import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

// 1. Specify protected and public routes
const protectedRoutes = ["/my-trips", "/create-trip", "/trip/*"];
const publicRoutes = ['/auth', "/"];
const allowedOrigins = ['https://travel-planner-ai-web.onrender.com/', 'http://localhost:3000/'];

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path) || path.startsWith('/trip');
  const isPublicRoute = publicRoutes.includes(path);

  // Decrypt the session from the cookie
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);

  // CORS handling
  const origin = req.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);
  const isPreflight = req.method === 'OPTIONS';

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Redirect logic
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/auth', req.nextUrl));
  }

  if (isPublicRoute && session?.userId && path === '/auth') {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (isPublicRoute && session?.userId && !req.nextUrl.pathname.startsWith('/')) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return response;
}

export const config = {
  matcher: '/:path*',
};
