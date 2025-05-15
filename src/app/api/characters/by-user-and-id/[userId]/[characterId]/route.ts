import { NextResponse } from 'next/server';
import prisma from '../../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

export async function GET(
    req: Request,
    { params } : { params: Promise<{ userId: string, characterId:string }> }
) {
    const { userId, characterId } = await params;

    const userIdBigInt = BigInt(userId);
    const characterIdBigInt = BigInt(characterId);

    const character = await prisma.character.findUnique({
        where: {
            id: characterIdBigInt,
            userId: userIdBigInt,
        },
        include: {
            campaign: true,
            inventory: true,
        },
    });

    if (!character) {
        return NextResponse.json({ error: 'Personagem não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(fixBigInt(character));
}
