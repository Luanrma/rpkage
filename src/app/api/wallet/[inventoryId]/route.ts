import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';

export async function POST(req: Request) {
	const body = await req.json();
	const { name, userId, campaignId, sheet, role } = body;

	if (!name || !userId || !campaignId || !role) {
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
				name,
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

		return newCharacter;
	});

	return NextResponse.json(fixBigInt(created), { status: 201 });
}

interface WalletTransaction {
    toWalletId: string,
    fromWalletId?: string,
    transactionType: string,
    campaignId: string,
    amount: string,
}

const createCurrencyTransaction = async (payload: WalletTransaction) => {
    const {
        toWalletId,
        fromWalletId,
        transactionType,
        campaignId,
        amount,
    } = payload;

    try {
        return await prisma.$transaction(async (tx) => {
            
            if (!toWalletId || !transactionType || !campaignId || !amount) {
                throw new Error("Required value empty");
            }

            const incomingAmount = Number(amount);
            if (incomingAmount === 0) {
                throw new Error("Você não tem saldo o suficiente para essa transação.");
            }
            // 1. Verificar se a origem tem saldo suficiente (somente se itemId != null)
            if (fromWalletId) {
                const fromWallet = await tx.wallet.findUnique({
                    where: { id: BigInt(fromWalletId) },
                });
                
                const fromAmount = Number(fromWallet?.amount || 0);

                if (fromAmount < incomingAmount) {
                    throw new Error("Saldo insuficiente para completar a transação.");
                }

                // Subtrai o valor da origem
                await tx.wallet.update({
                    where: { inventoryId: fromInventoryId },
                    data: {
                        amount: (fromAmount - incomingAmount).toString(),
                    },
                });
            }

            // 2. Adiciona o valor ao destino
            const existingCurrency = await tx.wallet.findUnique({
                where: { inventoryId: toInventoryId },
            });

            const currentAmount = Number(existingCurrency?.amount || 0);
            const newAmount = currentAmount + incomingAmount;

            await tx.wallet.upsert({
                where: { inventoryId: toInventoryId },
                update: {
                    amount: newAmount.toString()
                },
                create: {
                    inventoryId: toInventoryId,
                    currencyId: BigInt(campaignCurrencyId),
                    amount: newAmount.toString(),
                },
            });

            // 3. Cria histórico da transação
            /*await tx.currencyTransactionHistory.create({
                data: {
                    campaignId,
                    walletId: toWalletId,
                    fromWalletId,
                    transactionType,
                    amount: itemValue,
                },
            });*/

            return Number(newAmount);
        });
    } catch (error: any) {
        throw new Error(error.message || "Erro na transação monetária");
    }
};

export async function GET(
    req: NextRequest,
    { params } : { params: Promise<{ inventoryId: string }> }
) {
    const { inventoryId } = await params;

    if (!inventoryId) {
        return NextResponse.json({ message: 'inventoryId is required' }, { status: 400 });
    }

    try {
        const inventoryIdBigInt = BigInt(inventoryId);

        const wallet = await prisma.wallet.findUnique({
            where: { inventoryId: inventoryIdBigInt },
        });

        return NextResponse.json(fixBigInt(wallet));
    } catch (error) {
        return NextResponse.json({ message: 'Invalid inventoryId format' }, { status: 400 });
    }
}
