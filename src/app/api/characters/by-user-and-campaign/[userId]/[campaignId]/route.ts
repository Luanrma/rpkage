import { NextResponse } from 'next/server';
import prisma from '../../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

type Params = {
    params: {
        userId: string;
        campaignId: string;
    };
};

export async function GET(req: Request, { params }: Params) {
    const { userId, campaignId } = await params;

    const userIdBigInt = await BigInt(userId);
    const campaignIdBigInt = await BigInt(campaignId);

    const character = await prisma.character.findFirst({
        where: {
            userId: userIdBigInt,
            campaignId: campaignIdBigInt,
        },
        include: {
            campaign: true,
            inventory: true,
        },
    });

    if (!character) {
        return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json(fixBigInt(character));
}
