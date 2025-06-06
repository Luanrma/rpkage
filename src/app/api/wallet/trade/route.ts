import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';
import { createCurrencyTransaction, SaveWalletPayload } from '@/app/services/itemService/itemService';

export async function GET() {
    const wallets = await prisma.wallet.findMany();
    return NextResponse.json(fixBigInt(wallets));
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            campaignId,
            toWalletId,
            fromWalletId,
            transactionType,
            amount
        } = body;
        
        if (!campaignId || !toWalletId || !transactionType || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const payload = {
            campaignId,
            toWalletId: Number(toWalletId),
            fromWalletId: fromWalletId ? Number(fromWalletId) : null,
            transactionType,
            amount
        } as SaveWalletPayload
 
        const newItem = await createCurrencyTransaction(payload)

        return NextResponse.json(fixBigInt(newItem), { status: 201 });

    } catch (error) {
        console.error('POST /api/items error:', error);

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}