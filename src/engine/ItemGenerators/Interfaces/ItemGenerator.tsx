export interface SelectedOpt {
    description?: string;
    status?: string;
    diceBonus?: string;
}

export interface InterfaceItemGenerator {
    id?: number,
    inventoryItemId?: number,
    name: string,
    type: string;
    rarity: string;
    slot: string;
    attributes: SelectedOpt[];
}