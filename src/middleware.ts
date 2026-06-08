import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    const expectedUser = process.env.APP_USERNAME || 'homesync';
    const expectedPwd = process.env.APP_PASSWORD || 'homesync-secure-password';

    if (user === expectedUser && pwd === expectedPwd) {
      return NextResponse.next();
    }
  }

  url.pathname = '/api/auth';
  return new NextResponse('Authentication required to access HomeSync', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - icon.png (PWA icon)
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icon.png).*)',
  ],
};
