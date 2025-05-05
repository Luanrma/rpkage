import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server'

const publicRoutes = [
  { path: '/sign-in', whenAuthenticated: 'redirect' },
  { path: '/register', whenAuthenticated: 'redirect' },
  { path: '/', whenAuthenticated: 'next' },
] as const

const protectedRoutes = [
  { path: '/item-generator', allowedTypes: ['MASTER', 'ADMIN'] },
]

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/sign-in'
const REDIRECT_WHEN_FORBIDDEN = '/unauthorized'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('token')?.value

  // Liberar rotas públicas
  const publicRoute = publicRoutes.find(route => route.path === path)
  // Verifica se a rota exige tipo de usuário
  const restricted = protectedRoutes.find(route => route.path === path)

  // 1. Caso o token esteja ausente, permite acesso a rotas públicas
  if (!token && publicRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE
    return NextResponse.redirect(redirectUrl)
  }

  // 2. Bloqueia quem não tem token e tenta acessar rotas protegidas
  if (!token && !publicRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE
    return NextResponse.redirect(redirectUrl)
  }

  // 3. Caso o usuário esteja logado e tente acessar uma rota pública, redireciona para a home
  if (token && publicRoute?.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  // 4. Caso o token esteja presente e a rota seja protegida, valida o tipo de usuário
  if (token && restricted) {
    try {
      const payload = decodeToken(token)

      // Log do payload para depuração
      console.log("Payload do token:", payload)

      if (payload && !restricted.allowedTypes.includes(payload.type)) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = REDIRECT_WHEN_FORBIDDEN
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

type TokenPayload = {
  id: string
  email: string
  type: string
}

function decodeToken(token: string): TokenPayload | null {
  try {
    const payloadBase64 = token.split('.')[1]
    const decodedPayload = JSON.parse(atob(payloadBase64))
    return decodedPayload
  } catch (err) {
    return null
  }
}

export const config: MiddlewareConfig = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
