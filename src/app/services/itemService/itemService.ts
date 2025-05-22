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

const WalletTransferSchema = z.object({
    campaignId: z.number(),
    toWalletId: z.number(),
    fromWalletId: z.number().nullable().optional(),
    transactionType: z.enum(['DROP', 'TRADE', 'SELL', 'GIFT']),
    amount: z.string()
});

export type SaveItemPayload = z.infer<typeof SaveItemSchema>;
export type SaveWalletPayload = z.infer<typeof WalletTransferSchema>;

export async function createItemIfNecessaryAndLinkToInventory(payload: SaveItemPayload): Promise<number> {
    const validation = SaveItemSchema.safeParse(payload);

    if (!validation.success) {
        throw new Error(validation.error.message);
    }

    return createItemTransaction(payload)
}

export const createCurrencyTransaction = async (payload: SaveWalletPayload) => {
    const validation = WalletTransferSchema.safeParse(payload);

    if (!validation.success) {
        throw new Error(validation.error.message);
    }

    const {
        campaignId,
        toWalletId,
        fromWalletId,
        transactionType,
        amount
    } = payload;

    try {
        if (!campaignId || !toWalletId || !transactionType || !amount) {
            throw new Error("Required value empty");
        }

        const incomingAmount = Number(amount);
        if (isNaN(incomingAmount) || incomingAmount <= 0) {
            throw new Error("Informe um valor válido maior que zero para a transação.");
        }

        // 1. Se a transação envolve retirada de saldo fromWalletId tem valor
        if (fromWalletId) {
            const fromCurrency = await prisma.wallet.findUnique({
                where: { id: fromWalletId },
            });

            if (!fromCurrency) {
                throw new Error("Carteira de origem não encontrada.");
            }

            const fromAmount = Number(fromCurrency?.amount || 0);
            if (fromAmount < incomingAmount) {
                throw new Error("Saldo insuficiente para completar a transação.");
            }

            // Subtrai o valor da origem
            await prisma.wallet.update({
                where: { id: fromWalletId },
                data: {
                    amount: (fromAmount - incomingAmount).toString(),
                },
            });
        }

        // 2. Adiciona o valor ao destino
        const toCurrency = await prisma.wallet.findUnique({ where: { id: toWalletId } })
        if (!toCurrency) {
            throw new Error("Carteira de destino não encontrada.");
        }

        const currentAmount = Number(toCurrency.amount || 0);
        const newAmount = currentAmount + incomingAmount;

        await prisma.wallet.update({
            where: { id: toWalletId },
            data: { amount: newAmount.toString() }
        });

        // 3. Cria histórico da transação
        /* await tx.currencyTransactionHistory.create({
            data: {
                campaignId,
                walletId: toWalletId,
                fromWalletId,
                transactionType,
                amount: amount,
            },
        });*/

        return Number(newAmount);
     
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

    const itemIdFinal = itemId ?? fixBigInt((await prisma.items.create({
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
        await prisma.inventoryItem.create({
            data: {
                inventoryId: toInventoryId,
                itemsId: BigInt(itemIdFinal),
            },
        });
    }

    // Se o item está vinculado a algum inventário, remove ele da origem
    if (inventoryItemId) {
        await prisma.inventoryItem.delete({
            where: { id: inventoryItemId }
        })
    }

    // Cria histórico de transação
    /* const finalItemValue = transactionType === 'SELL' ? itemValue : '0';
    await tx.itemTransactionHistory.create({
        data: {
            itemId: BigInt(itemIdFinal),
            campaignId,
            inventoryId: toInventoryId,
            fromInventoryId: fromInventoryId,
            transactionType,
            amount: finalItemValue
        },
    });*/

    return itemIdFinal;
}
