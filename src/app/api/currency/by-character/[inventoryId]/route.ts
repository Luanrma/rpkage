import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

export async function GET(
    req: NextRequest,
    { params } : { params: Promise<{ campaingId: string }> }
) {
    const { campaingId } = await params;

    if (!campaingId) {
        return NextResponse.json({ message: 'campaingId is required' }, { status: 400 });
    }

    try {
        const campaingIdBigInt = BigInt(campaingId);
        const currency = await prisma.currency.findUnique({
            where: { campaignId: campaingIdBigInt },
        });

        return NextResponse.json(fixBigInt(currency));
    } catch (error) {
        return NextResponse.json({ message: 'Invalid campaingId format' }, { status: 400 });
    }
}
