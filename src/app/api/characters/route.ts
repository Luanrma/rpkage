import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

// Buscar todos os personagens
export async function GET() {
	const characters = await prisma.character.findMany({
		include: {
			user: true,
			campaign: true,
			inventory: true,
			equippedSpells: true,
			equippedItems: true,
			battleHistory: true,
		},
	});

	return NextResponse.json(fixBigInt(characters));
}

export async function POST(req: Request) {
	const body = await req.json();
	const {userId, campaignId, sheet, role } = body;

	if (!sheet.name || !userId || !campaignId || !role) {
		return NextResponse.json({ error: 'Nome, userId, campaignId e role são obrigatórios.' }, { status: 400 });
	}

	const userIdBigInt = BigInt(userId);
	const campaignIdBigInt = BigInt(campaignId);

	// Verifica se já existe personagem para o jogador nessa campanha
	const existingCharacter = await prisma.character.findFirst({
		where: {
			userId: userIdBigInt,
			campaignId: campaignIdBigInt,
		},
	});

	if (existingCharacter) {
		return NextResponse.json({ error: 'Você já possui um personagem nesta campanha.' }, { status: 400 });
	}

	// Transação: criar personagem e inventário
	const created = await prisma.$transaction(async (tx) => {
		const newCharacter = await tx.character.create({
			data: {
				name: sheet.name,
				userId: userIdBigInt,
				campaignId: campaignIdBigInt,
				sheet,
			},
		});

		await tx.inventory.create({
			data: {
				characterId: newCharacter.id,
			},
		});

		await tx.wallet.create({
			data: {
				characterId: newCharacter.id,
				amount: "0"
			},
		});


		return newCharacter;
	});

	return NextResponse.json(fixBigInt(created), { status: 201 });
}