import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

export async function GET(
    req: NextRequest,
    { params } : { params: Promise<{ campaignId: string }> }
) {
    const { campaignId } = await params;

    if (!campaignId) {
        return NextResponse.json({ message: 'CampaignId is required' }, { status: 400 });
    }

    try {
        const campaignIdBigInt = BigInt(campaignId);

        const characters = await prisma.character.findMany({
            where: { campaignId: campaignIdBigInt },
            select: {
                id: true,
                name: true,
                userId: true,
                sheet: true,
                inventory: {
                    select: {
                        id: true,
                    },
                },
                user: {
                    select: {
                        campaignUsers: {
                            where: {
                                campaignId: campaignIdBigInt,
                            },
                            select: {
                                role: true,
                            },
                        },
                    },
                },
            },
        });

        const parsed = characters.map((char: any) => ({
            id: char.id,
            userId: char.userId,
            inventoryId: char.inventory?.id ?? null,
            name: char.name,
            role: char.user.campaignUsers[0]?.role ?? null,
            sheet: char.sheet

        }));
        console.log(parsed)
        return NextResponse.json(fixBigInt(parsed));
    } catch (error) {
        return NextResponse.json({ message: 'Invalid campaignId format' }, { status: 400 });
    }
}
