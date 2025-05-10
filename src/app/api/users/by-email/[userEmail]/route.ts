import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';
import { z } from 'zod';

const EmailSchema = z.string().email();

export async function GET(req: NextRequest, context: { params: { userEmail: string } }) {
    try {
        // Aguarde o carregamento dos parâmetros da URL
        const { userEmail } = await context.params;

        const decodedEmail = decodeURIComponent(userEmail);
        const parse = EmailSchema.safeParse(decodedEmail);

        if (!parse.success) {
            return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 });
        }

        const email = parse.data;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Garante que sempre será retornado um array
        return NextResponse.json(user ? [fixBigInt(user)] : []);
    } catch (error) {
        return NextResponse.json({ message: 'Erro na requisição' }, { status: 400 });
    }
}
