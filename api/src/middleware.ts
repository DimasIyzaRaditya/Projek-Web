import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware function that runs before requests are completed
 * Useful for authentication, logging, redirects, etc.
 */
export function middleware(request: NextRequest) {
  // Log incoming request
  console.log(`[Middleware] ${request.method} ${request.url}`);

  // Get the pathname of the request
  const { pathname } = request.nextUrl;
  
  // Example: Add custom headers to the response
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'middleware-header');
  response.headers.set('x-pathname', pathname);

  // Example: CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

/**
 * Config object to specify which paths the middleware should run on
 * This helps optimize performance by only running middleware where needed
 */
export const config = {
  matcher: [
    '/api/:path*',
  ],
};
