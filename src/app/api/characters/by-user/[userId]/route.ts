import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

export async function GET(
    req: NextRequest,
    { params } : { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        // Convertendo userId para BigInt de forma segura
        const userIdBigInt = BigInt(userId);

        const characters = await prisma.character.findMany({
            where: { userId: userIdBigInt },
            include: { campaign: true },
        });

        return NextResponse.json(fixBigInt(characters));
    } catch (error) {
        return NextResponse.json({ message: 'Invalid userId format' }, { status: 400 });
    }
}
