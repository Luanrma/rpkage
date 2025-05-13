import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { inventoryId, name, amount } = body;

        if (!inventoryId || !name || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newItem = await prisma.monetary.create({
            data: {
                inventoryId,
                name,
                amount
            }
        });

        return NextResponse.json(fixBigInt(newItem), { status: 201 });

    } catch (error) {
        console.error('POST /api/monetary error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, inventoryId, amount } = body;

        if (!id || !inventoryId || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const monetary = await prisma.monetary.update({
            where: { id, inventoryId },
            data: { amount }
        });

        return NextResponse.json(fixBigInt(monetary), { status: 201 });

    } catch (error) {
        console.error('PUT /api/monetary error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
