import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';
import { createCurrencyTransaction, CurrencyTransactionPayload } from '@/app/services/itemService/itemService';

export async function GET() {
    const wallets = await prisma.wallet.findMany();
    return NextResponse.json(fixBigInt(wallets));
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            characterId,
            campaignId,
            toWalletId,
            fromWalletId,
            transactionType,
            amount
        } = body;
        
        if (!characterId || !campaignId || !toWalletId || !transactionType || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const payload = {
            characterId,
            campaignId,
            toWalletId,
            fromWalletId,
            transactionType,
            amount
        } as CurrencyTransactionPayload
 
        const newItem = createCurrencyTransaction(payload)

        return NextResponse.json(fixBigInt(newItem), { status: 201 });

    } catch (error) {
        console.error('POST /api/items error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}