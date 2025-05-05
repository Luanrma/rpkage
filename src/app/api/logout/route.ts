import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Logout realizado com sucesso' })

  // Remover o cookie 'token'
  response.cookies.set({
    name: 'token',
    value: '', // Define como vazio
    httpOnly: true,
    maxAge: 0, // Expira o cookie
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return response
}
