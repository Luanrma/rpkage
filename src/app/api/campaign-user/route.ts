import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

interface CampaignUserInput {
    userId: number;
    campaignId: number;
    role: 'PLAYER' | 'MASTER';
}

export async function GET() {
	const campaignUser = await prisma.campaignUser.findMany({
		include: {
			campaign: true,
		},
	});

	return NextResponse.json(fixBigInt(campaignUser));
}

export async function POST(req: Request) {
	const body: CampaignUserInput = await req.json();

	const { userId, campaignId, role } = body;

	if (!userId || !campaignId) {
		return NextResponse.json({ error: 'userId e campaignId são obrigatórios.' }, { status: 400 });
	}

    if (role !== 'PLAYER' && role !== 'MASTER') {
        return NextResponse.json({ error: 'Role inválido.' }, { status: 400 });
    }

	const newCampaignUser = await prisma.campaignUser.create({
		data: {
			userId,
			campaignId,
			role
		},
	});

	return NextResponse.json(fixBigInt(newCampaignUser), { status: 201 });
}
