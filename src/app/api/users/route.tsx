import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt'; // ajusta o path se necessário

export async function GET() {
  const users = await prisma.user.findMany();

  return NextResponse.json(fixBigInt(users));
}