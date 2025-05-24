import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';
import { createItemTransaction, SaveItemPayload } from '@/app/services/itemService/itemService';

export async function GET() {
    const items = await prisma.items.findMany();
    return NextResponse.json(fixBigInt(items));
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            itemId,
            inventoryItemId,
            characterId,
            campaignId,
            toInventoryId,
            fromInventoryId,
            name,
            slot,
            type,
            rarity,
            attributes,
            transactionType,
            itemValue,
            campaignCurrencyId,
			campaignCurrencyName
        } = body;
        
        if (!characterId || !campaignId || !toInventoryId || !type || !rarity || !rarity || !slot || !attributes) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const payload = {
            itemId,
            inventoryItemId,
            characterId: Number(characterId),
            campaignId: Number(campaignId),
            toInventoryId: Number(toInventoryId),
            fromInventoryId: fromInventoryId ? Number(fromInventoryId) : null,
            type,
            rarity,
            name,
            slot,
            attributes,
            transactionType,
            itemValue,
            campaignCurrencyId,
            campaignCurrencyName
        } as SaveItemPayload
 
        const newItem = await createItemTransaction(payload)

        return NextResponse.json(newItem, { status: 201 });

    } catch (error) {
        console.error('POST /api/items error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}