import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

export async function GET() {
	const campaign = await prisma.currency.findMany({
		include: {
			Wallet: true,
		},
	});
    
	return NextResponse.json(fixBigInt(campaign));
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { campaignId, name } = body;

        if (!campaignId || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newItem = await prisma.currency.create({
            data: {
                campaignId,
                name,
            }
        });

        return NextResponse.json(fixBigInt(newItem), { status: 201 });

    } catch (error) {
        console.error('POST /api/monetary error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/*export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, inventoryId, amount } = body;

        if (!id || !inventoryId || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const currency = await prisma.currency.update({
            where: { id, inventoryId },
            data: { amount }
        });

        return NextResponse.json(fixBigInt(currency), { status: 201 });

    } catch (error) {
        console.error('PUT /api/monetary error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}*/
