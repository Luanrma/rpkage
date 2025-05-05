// /api/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/jwt'
import prisma from '../../../../prisma/ConnectionPrisma'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    select: { name: true, type: true, email: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  return NextResponse.json(user)
}
