import { NextRequest, NextResponse } from 'next/server'
import { signToken } from '../../../../lib/jwt'
import prisma from '../../../../prisma/ConnectionPrisma' // ajuste se necessário
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.password) {
        return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    const token = signToken({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        type: user.type,
    })

    const response = NextResponse.json({
        message: 'Login realizado com sucesso',
        id: user.id.toString(),
        name: user.name,
        type: user.type,
    })
    
    response.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    })

    return response
}
