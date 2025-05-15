import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

export async function GET() {
    const inventoryItems = await prisma.inventoryItem.findMany();
    return NextResponse.json(fixBigInt(inventoryItems));
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { inventoryId, itemId } = body;

        if (!inventoryId || !itemId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newInventoryItem = await prisma.inventoryItem.create({
            data: {
                inventoryId,
                itemsId: itemId
            }
        });

        return NextResponse.json(fixBigInt(newInventoryItem), { status: 201 });

    } catch (error) {
        console.error('POST /api/inventory-item error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}