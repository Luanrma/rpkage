import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/ConnectionPrisma';

// Buscar todos os personagens
export async function GET() {
  const characters = await prisma.character.findMany({
    include: {
      user: true,
      session: true,
    },
  });

  return NextResponse.json(characters);
}

// Criar um personagem novo
export async function POST(req: Request) {
  const body = await req.json();

  const { name, userId, sessionId, sheet } = body;

  if (!name || !userId) {
    return NextResponse.json({ error: 'Nome e userId são obrigatórios.' }, { status: 400 });
  }

  const newCharacter = await prisma.character.create({
    data: {
      name,
      userId: BigInt(userId),
      sessionId: sessionId ? BigInt(sessionId) : undefined,
      sheet,
    },
  });

  return NextResponse.json(newCharacter, { status: 201 });
}
