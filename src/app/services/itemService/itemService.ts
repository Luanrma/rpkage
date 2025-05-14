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
});

export type SaveItemPayload = z.infer<typeof SaveItemSchema>;

export async function createItemIfNecessaryAndLinkToInventory(payload: SaveItemPayload): Promise<number> {
    const validation = SaveItemSchema.safeParse(payload);
    console.log(payload)
    if (!validation.success) {
        throw new Error(validation.error.message);
    }

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
        // Criação do item, se necessário
        const itemIdFinal = itemId ?? fixBigInt((await tx.items.create({
            data: {
                campaignId,
                type,
                rarity,
                name,
                slot: slot || 'In your pocket',
                attributes: attributes ?? [],
            },
        })).id);

        // Linka item ao inventário, se necessário
        if (toInventoryId && inventoryItemId) {
            await tx.inventoryItem.create({
                data: {
                    inventoryId: toInventoryId,
                    itemsId: BigInt(itemIdFinal),
                },
            });

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
