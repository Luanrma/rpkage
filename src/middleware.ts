// src/middleware.ts
import { jwtDecode } from 'jwt-decode'
import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server'

const PATH_SIGN_IN = '/sign-in'
const PATH_SELECT_OR_CREATE_CAMPAIGN = '/'
const REDIRECT_FORBIDDEN = '/unauthorized'

const PUBLIC_ROUTES = [
	{ path: PATH_SIGN_IN, whenAuthenticated: 'redirect' },
]

const PROTECTED_ROUTES = [
	{ path: '/item-generator', allowedTypes: ['MASTER', 'ADMIN'] },
	{ path: '/user', allowedTypes: ['MASTER', 'ADMIN'] },
]

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname
	const token = request.cookies.get('token')?.value ?? null

	if (!token) {
		return handleNoTokenAccess(path, request)
	}

	const hasValidToken = decodeToken(token)
	if (!hasValidToken) {
		return redirectTo(request, PATH_SIGN_IN)
	}

	if (isAuthenticatedTryingToAccessPublic(path)) {
		return redirectTo(request, PATH_SELECT_OR_CREATE_CAMPAIGN)
	}

	if (!hasCampaignUserId(hasValidToken) && path !== '/') {
		return redirectTo(request, PATH_SELECT_OR_CREATE_CAMPAIGN)
	}

	if (isAccessingRestrictedRoute(path)) {
		const route = findRestrictedRoute(path)
		if (!route?.allowedTypes.includes(hasValidToken.type)) {
			return redirectTo(request, REDIRECT_FORBIDDEN)
		}
	}

	return NextResponse.next()
}

// === Helpers ===
type TokenPayload = {
	id: string
	name: string
	email: string
	type: string
	campaignUserId?: string
}

function handleNoTokenAccess(path: string, request: NextRequest): NextResponse {
	return isPublicRoute(path)
		? NextResponse.next()
		: redirectTo(request, PATH_SIGN_IN)
}

function decodeToken(token: string): TokenPayload | null {
	try {
		return jwtDecode<TokenPayload>(token)
	} catch {
		return null
	}
}

function hasCampaignUserId(payload: TokenPayload): boolean {
	return !!payload.campaignUserId
}

function isPublicRoute(path: string): boolean {
	return PUBLIC_ROUTES.some(route => route.path === path)
}

function isAuthenticatedTryingToAccessPublic(path: string): boolean {
	const route = PUBLIC_ROUTES.find(r => r.path === path)
	return !!route && route.whenAuthenticated === 'redirect'
}

function isAccessingRestrictedRoute(path: string): boolean {
	return PROTECTED_ROUTES.some(route => route.path === path)
}

function findRestrictedRoute(path: string) {
	return PROTECTED_ROUTES.find(route => route.path === path)
}

function redirectTo(request: NextRequest, destination: string): NextResponse {
	const url = request.nextUrl.clone()
	url.pathname = destination
	return NextResponse.redirect(url)
}


export const config: MiddlewareConfig = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
