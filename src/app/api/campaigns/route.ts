import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

// Buscar todas as sessões
export async function GET() {
	const campaign = await prisma.campaign.findMany({
		include: {
			characters: true,
		},
	});

	return NextResponse.json(fixBigInt(campaign));
}

// Criar uma sessão nova
export async function POST(req: Request) {
	const body = await req.json();

	const { name, description, active } = body;

	if (!name) {
		return NextResponse.json({ error: 'Nome da sessão é obrigatório.' }, { status: 400 });
	}

	const newCampaign = await prisma.campaign.create({
		data: {
			name,
			description,
			active: active ?? true, // se não mandar, assume true
		},
	});

	return NextResponse.json(fixBigInt(newCampaign), { status: 201 });
}