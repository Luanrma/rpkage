import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';
import {
  createItemTransaction,
  SaveItemPayload,
} from '@/app/services/itemService/itemService';
import { z } from 'zod';

export async function GET() {
  const items = await prisma.items.findMany();
  return NextResponse.json(fixBigInt(items));
}

const TradeValidator = z.object({
  itemId: z.union([z.string(), z.number()]).transform(Number),
  inventoryItemId: z.union([z.string(), z.number()]).transform(Number),
  characterId: z.union([z.string(), z.number()]).transform(Number),
  campaignId: z.union([z.string(), z.number()]).transform(Number),
  toInventoryId: z.union([z.string(), z.number()]).transform(Number),
  fromInventoryId: z.union([z.string(), z.number()]).transform(Number),
  name: z.string(),
  slot: z.string(),
  type: z.string(),
  rarity: z.string(),
  attributes: z.array(z.any()),
  transactionType: z.string(),
  itemValue: z.union([z.string(), z.number()]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = TradeValidator.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error },
        { status: 400 }
      );
    }

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
      itemValue,
    } = parsed.data;

    const payload = {
      itemId,
      inventoryItemId,
      characterId,
      campaignId,
      toInventoryId,
      fromInventoryId,
      type,
      rarity,
      name,
      slot,
      attributes,
      itemValue,
    } as SaveItemPayload;

    const newItem = await createItemTransaction(payload);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('POST /api/items error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
