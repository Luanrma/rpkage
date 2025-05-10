// app/api/token/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { signToken, verifyToken } from '../../../../../lib/jwt'

type TokenPayload = {
    id: string
    name: string
    email: string
    type: string
    campaignUserId?: string
    iat?: number
    exp?: number
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get('token')?.value
    const body = await req.json()
    const { campaignUserId } = body

    if (!token) return new NextResponse('Token ausente', { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return new NextResponse('Token inválido', { status: 401 })

    const { exp, iat, ...rest } = payload as TokenPayload // remove campos automáticos
    const newToken = signToken({ ...rest, campaignUserId })

    const response = NextResponse.json({ success: true })
    response.cookies.set('token', newToken, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    return response
}
