-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignUser" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "campaignId" BIGINT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "campaignId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "sheet" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" BIGSERIAL NOT NULL,
    "characterId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" BIGSERIAL NOT NULL,
    "inventoryId" BIGINT NOT NULL,
    "itemsId" BIGINT NOT NULL,
    "quantity" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Items" (
    "id" BIGSERIAL NOT NULL,
    "campaingId" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemTransactionHistory" (
    "id" BIGSERIAL NOT NULL,
    "itemId" BIGINT NOT NULL,
    "inventoryId" BIGINT NOT NULL,
    "fromInventoryId" BIGINT,
    "toInventoryId" BIGINT,
    "transactionType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemTransactionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquippedItem" (
    "id" BIGSERIAL NOT NULL,
    "characterId" BIGINT NOT NULL,
    "inventoryItemId" BIGINT NOT NULL,
    "slot" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquippedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spells" (
    "id" BIGSERIAL NOT NULL,
    "campaingId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "specifications" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquippedSpell" (
    "id" BIGSERIAL NOT NULL,
    "characterId" BIGINT NOT NULL,
    "spellId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquippedSpell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterBattleHistory" (
    "id" BIGSERIAL NOT NULL,
    "characterId" BIGINT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "description" TEXT,
    "xpGained" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CharacterBattleHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevelingRule" (
    "id" BIGSERIAL NOT NULL,
    "campaignId" BIGINT NOT NULL,
    "level" BIGINT NOT NULL,
    "requiredXp" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LevelingRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignUser_userId_campaignId_key" ON "CampaignUser"("userId", "campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_characterId_key" ON "Inventory"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "EquippedItem_inventoryItemId_key" ON "EquippedItem"("inventoryItemId");

-- AddForeignKey
ALTER TABLE "CampaignUser" ADD CONSTRAINT "CampaignUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignUser" ADD CONSTRAINT "CampaignUser_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_itemsId_fkey" FOREIGN KEY ("itemsId") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_campaingId_fkey" FOREIGN KEY ("campaingId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemTransactionHistory" ADD CONSTRAINT "ItemTransactionHistory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemTransactionHistory" ADD CONSTRAINT "ItemTransactionHistory_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquippedItem" ADD CONSTRAINT "EquippedItem_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquippedItem" ADD CONSTRAINT "EquippedItem_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spells" ADD CONSTRAINT "Spells_campaingId_fkey" FOREIGN KEY ("campaingId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquippedSpell" ADD CONSTRAINT "EquippedSpell_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquippedSpell" ADD CONSTRAINT "EquippedSpell_spellId_fkey" FOREIGN KEY ("spellId") REFERENCES "Spells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterBattleHistory" ADD CONSTRAINT "CharacterBattleHistory_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelingRule" ADD CONSTRAINT "LevelingRule_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
