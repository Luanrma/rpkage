import { NextResponse } from 'next/server';
import prisma from '../../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

type Params = {
    params: {
        campaignId: string;
        type: string;
    };
};

export async function GET(request: Request, { params }: Params) {
    const { campaignId, type } = await params;

    const campaignIdBigInt = await BigInt(campaignId);

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
