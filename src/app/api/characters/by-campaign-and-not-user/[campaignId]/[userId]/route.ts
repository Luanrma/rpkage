import { NextResponse } from 'next/server';
import { fixBigInt } from '@/utils/fixBigInt';
import { getOtherCharactersInTheCampaign } from '@/app/services/characterService/characterService';

export async function GET(
    req: Request, 
    { params } : { params: Promise<{ campaignId:string, userId: string }> }
) {
    const { campaignId, userId } = await params;
    const inventoriesByCampaign = await getOtherCharactersInTheCampaign(campaignId, userId)

    if (!inventoriesByCampaign) {
        return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json(fixBigInt(inventoriesByCampaign));
}
