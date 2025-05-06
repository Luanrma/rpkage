import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

// Buscar todos os personagens
export async function GET() {
  const characters = await prisma.character.findMany({
    include: {
      user: true,
      campaign: true,
    },
  });

  return NextResponse.json(fixBigInt(characters));
}

// Criar um personagem novo
export async function POST(req: Request) {
  const body = await req.json();
  const { name, userId, campaignId, sheet } = body;

  if (!name || !userId) {
    return NextResponse.json({ error: 'Nome e userId são obrigatórios.' }, { status: 400 });
  }

  const newCharacter = await prisma.character.create({
    data: {
      name,
      userId: BigInt(userId),
      campaignId: campaignId ? BigInt(campaignId) : undefined,
      sheet,
    },
  });

  return NextResponse.json(fixBigInt(newCharacter), { status: 201 });
}