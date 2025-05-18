import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

export async function GET(
	req: NextRequest,
	{ params } : { params: Promise<{ characterId:string }> }
) {
    const { characterId } = await params;

    if (!characterId) {
        return NextResponse.json({ message: 'CharacterId is required' }, { status: 400 });
    }

    try {
        const characterIdBigInt = BigInt(characterId);

        const inventory = await prisma.inventory.findUnique({
            where: { characterId: characterIdBigInt },
            include: {
                inventoryItems: {
                    include: {
                        item: true,
                    },
                },
                character: {
					include: {
						Wallet: true,
					},
				},
            },
        });

        console.log(inventory?.character.Wallet)
		
        return NextResponse.json(fixBigInt(inventory));
    } catch (error) {
        return NextResponse.json({ message: 'Invalid characterId format' }, { status: 400 });
    }
}