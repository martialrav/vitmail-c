import { NextResponse } from 'next/server';

const middleware = (req) => {
  const { host } = new URL(process.env.APP_URL || 'http://localhost:3000');
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get('host');

  // Don't rewrite if it's already a _sites path
  if (pathname.startsWith(`/_sites`)) {
    return NextResponse.next();
  }

  // Don't rewrite API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Don't rewrite static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  // Define your main domains
  const mainDomains = [
    'localhost:3000',
    'vitmail-c.com',
    'www.vitmail-c.com'
  ];

  // Check if it's a main domain
  const isMainDomain = mainDomains.includes(hostname) || hostname.includes('vercel.app');

  // Only rewrite if it's a subdomain (not the main domain)
  if (!isMainDomain && hostname !== host) {
    const currentHost = hostname.replace(`.${host}`, '');
    url.pathname = `/_sites/${currentHost}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // For main domain, just continue normally
  return NextResponse.next();
};

export default middleware;
