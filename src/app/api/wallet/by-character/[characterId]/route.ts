import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';
import { z } from 'zod';

const EmailSchema = z.string();

export async function GET(
    req: NextRequest,
    { params } : { params: Promise<{ characterId: string }> }
) {
    try {
        const { characterId } = await params;
        if (!characterId) {
            return NextResponse.json({ error: 'id inválido' }, { status: 400 });
        }

        const characterIdBigInt = BigInt(characterId);

        const wallet = await prisma.wallet.findUnique({
            where: { characterId: characterIdBigInt}
        });

        return NextResponse.json(wallet ? [fixBigInt(wallet)] : []);
    } catch (error) {
        return NextResponse.json({ message: 'Erro na requisição' }, { status: 400 });
    }
}
