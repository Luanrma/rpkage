import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

export async function PUT(req: Request) {
	const body = await req.json();
	const { id, payload } = body;
        
	if (!id || !payload.sheet ) {
		return NextResponse.json({ error: 'id e sheet são obrigatórios.' }, { status: 400 });
	}

	const sheet = payload.sheet;
	const name = payload.sheet.name.trim().split(' ')[0]

	const idBigInt = BigInt(id);
    const updateCharacterSheet = await prisma.character.update({
        where: { id: idBigInt },
        data: { name, sheet },
    });

	return NextResponse.json(fixBigInt(updateCharacterSheet), { status: 201 });
}