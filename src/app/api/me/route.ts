import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

type TokenPayload = {
	id: string
	name: string
	email: string
	type: string
}

function decodeToken(token: string): TokenPayload | null {
	try {
		const payloadBase64 = token.split('.')[1]
		const decoded = Buffer.from(payloadBase64, 'base64').toString('utf-8')
		return JSON.parse(decoded)
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
