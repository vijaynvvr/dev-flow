import { auth } from '@/auth'

export default auth(req => {
  // Protect API routes that require authentication
  if (
    req.nextUrl.pathname.startsWith('/api/repos') ||
    req.nextUrl.pathname.startsWith('/api/branches') ||
    req.nextUrl.pathname.startsWith('/api/diff') ||
    req.nextUrl.pathname.startsWith('/api/create-pr')
  ) {
    if (!req.auth) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
})

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
