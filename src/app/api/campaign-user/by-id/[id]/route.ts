import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';
import { verifyToken, signToken } from '../../../../../../lib/jwt' // ajuste o caminho se necessário

export async function GET(req: NextRequest, context: { params: { id: string } }) {
	const { id } = context.params;

	if (!id) {
		return NextResponse.json({ message: 'ID is required' }, { status: 400 });
	}

	try {
		const idBigInt = BigInt(id);

		const campaignUser = await prisma.campaignUser.findUnique({
			where: { id: idBigInt },
			include: { campaign: true, user: true },
		});

		if (!campaignUser) {
			return NextResponse.json({ message: 'campaignUser not found' }, { status: 404 });
		}

		// Busca token atual para extrair dados
		const token = req.cookies.get('token')?.value;
		if (!token) {
			return NextResponse.json({ message: 'Token not found' }, { status: 401 });
		}

		const decoded = verifyToken(token);
		if (!decoded) {
			return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
		}

		// Cria novo token com campaignUserId
		const newToken = signToken({
			id: decoded.id,
			email: decoded.email,
			name: decoded.name,
			type: decoded.type,
			campaignUserId: campaignUser.id.toString(), // novo valor adicionado
		});

		const response = NextResponse.json(fixBigInt(campaignUser));

		// Define novo cookie com o token atualizado
		response.cookies.set({
			name: 'token',
			value: newToken,
			httpOnly: true,
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 7 dias
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
		});

		return response;
	} catch (error) {
		return NextResponse.json({ message: 'Invalid id format' }, { status: 400 });
	}
}
