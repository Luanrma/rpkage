import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

export async function GET(
	req: NextRequest,
	{ params } : { params: Promise<{ campaignId: string }> }
) {
	const { campaignId } = await params;

	if (!campaignId) {
		return NextResponse.json({ message: 'campaignId is required' }, { status: 400 });
	}

	try {
		const campaignIdBigInt = BigInt(campaignId);

		// Busca todos os usuários da campanha
		const transactionHistory = await prisma.itemTransactionHistory.findMany({
			where: { campaignId: campaignIdBigInt }
		});

		return NextResponse.json(fixBigInt(transactionHistory));
	} catch (error) {
		console.error('Erro ao buscar transactionHistory por campaignId:', error);
		return NextResponse.json({ message: 'Invalid campaignId format or server error' }, { status: 400 });
	}
}
