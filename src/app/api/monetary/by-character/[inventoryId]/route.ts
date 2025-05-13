import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

export async function GET(context: { params: { inventoryId: string } }) {
    const { inventoryId } = await context.params;

    if (!inventoryId) {
        return NextResponse.json({ message: 'inventoryId is required' }, { status: 400 });
    }

    try {
        const inventoryIdBigInt = BigInt(inventoryId);
        const monetary = await prisma.monetary.findUnique({
            where: { inventoryId: inventoryIdBigInt },
        });

        return NextResponse.json(fixBigInt(monetary));
    } catch (error) {
        return NextResponse.json({ message: 'Invalid inventoryId format' }, { status: 400 });
    }
}
