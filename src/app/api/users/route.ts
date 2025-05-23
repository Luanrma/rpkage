import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';
import { hash } from 'bcryptjs';

export async function GET() {
    const users = await prisma.user.findMany();
    return NextResponse.json(fixBigInt(users));
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, avatar, type, active } = body;

        if (!name || !email || !password || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Criptografando a senha
        const hashedPassword = await hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                avatar: avatar || null,
                type,
                active: active !== undefined ? active : true,
            }
        });

        return NextResponse.json(fixBigInt(newUser), { status: 201 });

    } catch (error) {
        console.error('POST /api/users error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}