import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

type Params = {
  params: {
    campaignId: string;
  };
};

export async function GET(req: NextRequest, { params }: Params) {
  const { campaignId } = params;

  if (!campaignId) {
    return NextResponse.json({ message: 'campaignId is required' }, { status: 400 });
  }

  try {
    const campaignIdBigInt = BigInt(campaignId);

    const campaignUsers = await prisma.campaignUser.findMany({
      where: { campaignId: campaignIdBigInt },
      include: {
        user: true,
      },
    });

    return NextResponse.json(fixBigInt(campaignUsers));
  } catch (error) {
    console.error('Erro ao buscar campaignUsers por campaignId:', error);
    return NextResponse.json({ message: 'Invalid campaignId format or server error' }, { status: 400 });
  }
}
