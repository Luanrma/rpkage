import { NextResponse } from 'next/server';
import { fixBigInt } from '@/utils/fixBigInt';
import { getOtherCharactersInTheCampaign } from '@/app/services/characterService/characterService';

type Params = {
    params: {
        userId: string;
        campaignId: string;
    };
};

export async function GET(req: Request, { params }: Params) {
    const { campaignId, userId } = await params;
    const inventoriesByCampaign = await getOtherCharactersInTheCampaign(campaignId, userId)
    console.log(inventoriesByCampaign)
    if (!inventoriesByCampaign) {
        return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json(fixBigInt(inventoriesByCampaign));
}
