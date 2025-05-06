import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server'

const publicRoutes = [
	{ path: '/sign-in', whenAuthenticated: 'redirect' },
	{ path: '/register', whenAuthenticated: 'redirect' },
	{ path: '/home', whenAuthenticated: 'next' },
] as const

const protectedRoutes = [
	{ path: '/item-generator', allowedTypes: ['MASTER', 'ADMIN'] },
]

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/sign-in'
const REDIRECT_WHEN_FORBIDDEN = '/unauthorized'

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname
	const token = request.cookies.get('token')?.value ?? null

	if (isAccessingPublicWithoutToken(path, token)) {
		return NextResponse.next()
	}

	if (isAccessingProtectedWithoutToken(path, token)) {
		return redirectTo(request, REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE)
	}

	if (isAuthenticatedTryingToAccessPublic(path, token)) {
		return redirectTo(request, '/home')
	}

	if (isAccessingRestrictedRoute(path)) {
		const restricted = findRestrictedRoute(path)
		const payload = decodeToken(token)

		if (!payload || !restricted?.allowedTypes.includes(payload.type)) {
			return redirectTo(request, REDIRECT_WHEN_FORBIDDEN)
		}
	}

	return NextResponse.next()
}

// === Rules ===

function isAccessingPublicWithoutToken(path: string, token: string | null): boolean {
	return !token && isPublicRoute(path)
}

function isAccessingProtectedWithoutToken(path: string, token: string | null): boolean {
	return !token && !isPublicRoute(path)
}

function isAuthenticatedTryingToAccessPublic(path: string, token: string | null): boolean {
	const route = findPublicRoute(path)
	return !!token && route?.whenAuthenticated === 'redirect'
}

function isAccessingRestrictedRoute(path: string): boolean {
	return protectedRoutes.some(route => route.path === path)
}

// === Helpers ===

function isPublicRoute(path: string): boolean {
	return publicRoutes.some(route => route.path === path)
}

function findPublicRoute(path: string) {
	return publicRoutes.find(route => route.path === path)
}

function findRestrictedRoute(path: string) {
	return protectedRoutes.find(route => route.path === path)
}

type TokenPayload = {
	id: string
	name: string
	email: string
	type: string
}

function decodeToken(token: string | null): TokenPayload | null {
	try {
		if (!token) return null
		const payloadBase64 = token.split('.')[1]
		const decoded = Buffer.from(payloadBase64, 'base64').toString('utf-8')
		return JSON.parse(decoded)
	} catch {
		return null
	}
}

function redirectTo(request: NextRequest, path: string) {
	const redirectUrl = request.nextUrl.clone()
	redirectUrl.pathname = path
	return NextResponse.redirect(redirectUrl)
}

export const config: MiddlewareConfig = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
