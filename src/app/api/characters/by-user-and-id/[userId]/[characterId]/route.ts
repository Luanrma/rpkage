import { NextResponse } from 'next/server';
import prisma from '../../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

type Params = {
    params: {
        userId: string;
        characterId: string;
    };
};

export async function GET(req: Request, { params }: Params) {
    const userId = BigInt(params.userId);
    const characterId = BigInt(params.characterId);

    const character = await prisma.character.findUnique({
        where: {
            id: characterId,
            userId,
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
