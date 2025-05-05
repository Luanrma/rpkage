import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

// Buscar todas as sessões
export async function GET() {
  const sessions = await prisma.session.findMany({
    include: {
      characters: true,
    },
  });

  return NextResponse.json(sessions);
}

// Criar uma sessão nova
export async function POST(req: Request) {
  const body = await req.json();

  const { name, userId, description, active } = body;

  if (!name) {
    return NextResponse.json({ error: 'Nome da sessão é obrigatório.' }, { status: 400 });
  }

  const newSession = await prisma.session.create({
    data: {
      name,
      userId,
      description,
      active: active ?? true, // se não mandar, assume true
    },
  });

  return NextResponse.json(fixBigInt(newSession), { status: 201 });
}