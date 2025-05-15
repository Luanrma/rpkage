import { NextResponse } from 'next/server';
import prisma from '../../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

export async function GET(
    request: Request,
    { params } : { params: Promise<{ campaignId: string, type:string }> }
) {
    const { campaignId, type } = await params;
    const campaignIdBigInt = BigInt(campaignId);

    const currency = await prisma.items.findFirst({
        where: {
            campaignId: campaignIdBigInt,
            type
        },
    });

    if (!currency) {
        return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json(fixBigInt(currency));
}
