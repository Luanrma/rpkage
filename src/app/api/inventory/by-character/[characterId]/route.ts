import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';
import { z } from 'zod';

// Validação com Zod
const CampaignSchema = z.object({
	name: z.string().min(1, "Nome da campanha é obrigatório"),
	description: z.string(),
	active: z.boolean().optional(),
	userId: z.number() // precisamos saber quem está criando
});

export async function GET(req: NextRequest, context: { params: { characterId: string } }) {
    // Aguardando os parâmetros assíncronos
    const { characterId } = await context.params;  // Aguarde o contexto para acessar os parâmetros

    if (!characterId) {
        return NextResponse.json({ message: 'CharacterId is required' }, { status: 400 });
    }

    try {
        // Convertendo userId para BigInt de forma segura
        const characterIdBigInt = BigInt(characterId);

        const inventory = await prisma.inventory.findMany({
            where: { characterId: characterIdBigInt },
            include: {
                inventoryItems: {
                    include: {
                        item: true,
                    },
                },
            },
        });

        console.log(inventory[0].inventoryItems[0].item)

        return NextResponse.json(fixBigInt(inventory));
    } catch (error) {
        return NextResponse.json({ message: 'Invalid characterId format' }, { status: 400 });
    }
}

export async function POST(req: Request) {
	const body = await req.json();
	const parsed = CampaignSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
	}

	const { name, description, active = true, userId } = parsed.data;

	try {
		const newCampaign = await prisma.campaign.create({
			data: {
				name,
				description,
				active,
			},
		});

		await prisma.campaignUser.create({
			data: {
				userId,
				campaignId: newCampaign.id,
				role: 'MASTER',
			},
		});

		return NextResponse.json(fixBigInt(newCampaign), { status: 201 });

	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: 'Erro ao criar campanha.' }, { status: 500 });
	}
}
