import prisma from "../../../../prisma/ConnectionPrisma";

const characterCache = new Map<string, any>();

export async function getOtherCharactersInTheCampaign(campaignId: string, userId: string) {
	const cacheKey = `${campaignId}-${userId}`;

	// Verifica se já tem cache
	if (characterCache.has(cacheKey)) {
		return characterCache.get(cacheKey);
	}

	const userIdBigInt = BigInt(userId);
	const campaignIdBigInt = BigInt(campaignId);

	// Traz todos os personagens da campanha, sem filtrar o userId
	const characters = await prisma.character.findMany({
		where: {
			campaignId: campaignIdBigInt,
		},
		select: {
			id: true,
			name: true,
			userId: true,
			inventory: {
				select: {
					id: true,
				},
			},
			user: {
				select: {
					campaignUsers: {
						where: {
							campaignId: campaignIdBigInt,
						},
						select: {
							role: true,
						},
					},
				},
			},
			Wallet: true
		}
	});

	// Separa em dois grupos
	const currentPlayer = characters
		.filter(char => char.userId === userIdBigInt)
		.map(char => ({
			id: char.id,
			userId: char.userId,
			inventoryId: char.inventory?.id ?? null,
			walletId: char.Wallet[0]?.id ?? null,
			name: char.name,
			role: char.user.campaignUsers[0]?.role ?? null,
		}))[0];

	const othersPlayer = characters
		.filter(char => char.userId !== userIdBigInt)
		.map(char => ({
			id: char.id,
			userId: char.userId,
			inventoryId: char.inventory?.id ?? null,
			walletId: char.Wallet[0].id ?? null,
			name: char.name,
			role: char.user.campaignUsers[0]?.role ?? null,
		}));
	
	const result = {
		currentPlayer,
		othersPlayer,
	}

	// Armazena no cache
	characterCache.set(cacheKey, result);
	return result;
}
