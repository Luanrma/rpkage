import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

type TokenPayload = {
	id: string
	name: string
	email: string
	type: string
}

function decodeToken(token: string): TokenPayload | null {
	try {
		return jwtDecode<TokenPayload>(token)
	} catch {
		return null
	}
}

export async function GET() {
	const sessionCookies = await cookies()
	const token = sessionCookies.get('token')?.value
	const user = token ? decodeToken(token) : null
	if (!user) {
		return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
	}

	return NextResponse.json(user)
}
