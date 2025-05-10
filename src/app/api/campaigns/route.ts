import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';
import { z } from 'zod';

// Validação com Zod
const CampaignSchema = z.object({
	name: z.string().min(1, "Nome da campanha é obrigatório"),
	description: z.string(),
	active: z.boolean().optional(),
	userId: z.number() // precisamos saber quem está criando
});

export async function GET() {
	const campaign = await prisma.campaign.findMany({
		include: {
			characters: true,
			campaignUsers: true,
		},
	});

	return NextResponse.json(fixBigInt(campaign));
}

export async function POST(req: Request) {
	const body = await req.json();
	const parsed = CampaignSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
	}

	const { name, description, active = true } = parsed.data;

	try {
		const newCampaign = await prisma.campaign.create({
			data: {
				name,
				description,
				active,
			},
		});

		return NextResponse.json(fixBigInt(newCampaign), { status: 201 });

	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: 'Erro ao criar campanha.' }, { status: 500 });
	}
}
