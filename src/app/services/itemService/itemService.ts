import prisma from '../../../../prisma/ConnectionPrisma';
import { fixBigInt } from '@/utils/fixBigInt';
import { z } from 'zod';

// Validação com Zod
const SaveItemSchema = z.object({
    itemId: z.number().nullable().optional(),
    inventoryItemId: z.number().nullable().optional(),
    characterId: z.number().optional(),
    campaignId: z.number(),
    toInventoryId: z.number(),
    fromInventoryId: z.number().nullable().optional(),
    type: z.string(),
    rarity: z.string(),
    name: z.string(),
    slot: z.string(),
    attributes: z.array(z.any()),
    transactionType: z.enum(['DROP', 'TRADE', 'SELL', 'GIFT']),
    itemValue: z.string().nullable().optional(),
    campaignCurrencyName: z.string().nullable().optional(),
    campaignCurrencyId: z.string().nullable().optional(),
});

export type SaveItemPayload = z.infer<typeof SaveItemSchema>;

export async function createItemIfNecessaryAndLinkToInventory(payload: SaveItemPayload): Promise<number> {
    const validation = SaveItemSchema.safeParse(payload);

    if (!validation.success) {
        throw new Error(validation.error.message);
    }

    if (payload.type === "brics") {
        return createCurrencyTransaction(payload)
    }

    return createItemTransaction(payload)
}

const createCurrencyTransaction = async (payload: SaveItemPayload) => {
    const {
        itemId,
        toInventoryId,
        fromInventoryId,
        transactionType,
        campaignId,
        itemValue,
        campaignCurrencyName,
        campaignCurrencyId,
    } = payload;

    try {
        return await prisma.$transaction(async (tx) => {
            
            if (!toInventoryId || !campaignCurrencyId || !itemValue) {
                throw new Error("Required value empty");
            }

            const incomingAmount = Number(itemValue);
            if (incomingAmount === 0) {
                throw new Error("Você não tem saldo o suficiente para essa transação.");
            }
            // 1. Verificar se a origem tem saldo suficiente (somente se itemId != null)
            if (itemId && fromInventoryId) {
                const fromCurrency = await tx.currency.findUnique({
                    where: { inventoryId: fromInventoryId },
                });
                
                const fromAmount = Number(fromCurrency?.amount || 0);

                if (fromAmount < incomingAmount) {
                    throw new Error("Saldo insuficiente para completar a transação.");
                }

                // Subtrai o valor da origem
                await tx.currency.update({
                    where: { inventoryId: fromInventoryId },
                    data: {
                        amount: (fromAmount - incomingAmount).toString(),
                    },
                });
            }

            // 2. Adiciona o valor ao destino
            const existingCurrency = await tx.currency.findUnique({
                where: { inventoryId: toInventoryId },
            });

            const currentAmount = Number(existingCurrency?.amount || 0);
            const newAmount = currentAmount + incomingAmount;

            await tx.currency.upsert({
                where: { inventoryId: toInventoryId },
                update: {
                    amount: newAmount.toString(),
                    name: campaignCurrencyName ?? "currency",
                },
                create: {
                    inventoryId: toInventoryId,
                    name: campaignCurrencyName ?? "currency",
                    amount: newAmount.toString(),
                },
            });

            // 3. Cria histórico da transação
            await tx.itemTransactionHistory.create({
                data: {
                    itemId: BigInt(campaignCurrencyId),
                    campaignId,
                    inventoryId: toInventoryId,
                    fromInventoryId,
                    transactionType,
                    amount: itemValue,
                },
            });

            return Number(newAmount);
        });
    } catch (error: any) {
        throw new Error(error.message || "Erro na transação monetária");
    }
};


const createItemTransaction = async (payload: SaveItemPayload) => {
    const {
        itemId,
        inventoryItemId,
        toInventoryId,
        fromInventoryId,
        transactionType,
        campaignId,
        type,
        rarity,
        name,
        slot,
        attributes,
        itemValue,
    } = payload;
    
    return await prisma.$transaction(async (tx) => {
        const itemIdFinal = itemId ?? fixBigInt((await tx.items.create({
            data: {
                campaignId,
                type,
                rarity,
                name,
                slot: slot || 'In your pocket',
                attributes: attributes ?? [],
            }
        })).id);

        // Linka item ao inventário, se necessário
        if (toInventoryId) {
            await tx.inventoryItem.create({
                data: {
                    inventoryId: toInventoryId,
                    itemsId: BigInt(itemIdFinal),
                },
            });
        }

        // Se o item está vinculado a algum inventário, remove ele da origem
        if (inventoryItemId) {
            await tx.inventoryItem.delete({
                where: { id: inventoryItemId }
            })
        }

        // Cria histórico de transação
        const finalItemValue = transactionType === 'SELL' ? itemValue : '0';
        await tx.itemTransactionHistory.create({
            data: {
                itemId: BigInt(itemIdFinal),
                campaignId,
                inventoryId: toInventoryId,
                fromInventoryId: fromInventoryId,
                transactionType,
                amount: finalItemValue
            },
        });

        return itemIdFinal;
    });
}
