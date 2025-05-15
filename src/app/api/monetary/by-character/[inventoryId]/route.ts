import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

export async function GET(
    req: NextRequest,
    { params } : { params: Promise<{ inventoryId: string }> }
) {
    const { inventoryId } = await params;

    if (!inventoryId) {
        return NextResponse.json({ message: 'inventoryId is required' }, { status: 400 });
    }

    try {
        const inventoryIdBigInt = BigInt(inventoryId);
        const currency = await prisma.currency.findUnique({
            where: { inventoryId: inventoryIdBigInt },
        });

        return NextResponse.json(fixBigInt(currency));
    } catch (error) {
        return NextResponse.json({ message: 'Invalid inventoryId format' }, { status: 400 });
    }
}
