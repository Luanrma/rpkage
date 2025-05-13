import prisma from "../../../../prisma/ConnectionPrisma";

export async function getOtherCharactersInTheCampaign(campaignId: string, userId: string) {
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
		},
	});

	// Separa em dois grupos
	const currentPlayer = characters
		.filter(char => char.userId === userIdBigInt)
		.map(char => ({
			id: char.id,
			userId: char.userId,
			inventoryId: char.inventory?.id ?? null,
			name: char.name,
			role: char.user.campaignUsers[0]?.role ?? null,
		}))[0];

	const othersPlayer = characters
		.filter(char => char.userId !== userIdBigInt)
		.map(char => ({
			id: char.id,
			userId: char.userId,
			inventoryId: char.inventory?.id ?? null,
			name: char.name,
			role: char.user.campaignUsers[0]?.role ?? null,
		}));

	return {
		currentPlayer,
		othersPlayer,
	};
}
