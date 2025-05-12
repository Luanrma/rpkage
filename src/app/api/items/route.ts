import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

export async function GET() {
    const items = await prisma.items.findMany();
    return NextResponse.json(fixBigInt(items));
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { campaignId, type, rarity, description, attributes } = body;

        if (!campaignId || !type || !rarity || !description || !attributes) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newItem = await prisma.items.create({
            data: {
                campaingId: campaignId, // Preciso corrigir o nome dessa coluna na base
                type,
                rarity,
                description: description ?? "unknow item",
                attributes
            }
        });

        return NextResponse.json(fixBigInt(newItem), { status: 201 });

    } catch (error) {
        console.error('POST /api/items error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, campaignId, type, rarity, description, attributes } = body;
        console.log(body)
        if (!id || !campaignId || !type || !rarity || !description || !attributes) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newItem = await prisma.items.update({
            where: { id },
            data: {
                campaingId: campaignId, // Preciso corrigir o nome dessa coluna na base
                type,
                rarity,
                description: description ?? "unknow item",
                attributes
            }
        });

        return NextResponse.json(fixBigInt(newItem), { status: 201 });

    } catch (error) {
        console.error('PUT /api/items error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
