import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

// 1. Specify protected and public routes
const protectedRoutes = ["/my-trips", "/create-trip", "/trip/*"];
const publicRoutes = ['/auth', "/"];

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:3000/api/v1',
  'http://localhost:5173/api/v1',
  'https://travel-planner-ai-web.onrender.com',
  'https://travel-planner-ai-web.onrender.com/api/v1'
]


export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const origin = req.headers.get("origin")
  const isProtectedRoute = protectedRoutes.includes(path) || path.startsWith('/trip');
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);

  // 4. Redirect
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/auth', req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.userId &&
    path === '/auth'
  ) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/')
  ) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 400,
      statusText: "Bad Requset",
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  }

  return NextResponse.next();
}


export const config = {
  matcher: '/api/:path*'
}