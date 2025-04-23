export interface SelectedOpt {
    description?: string;
    status?: string;
    diceBonus?: string;
}

export interface InterfaceItemGenerator {
    type: string;
    rarity: string;
    model: string;
    options: SelectedOpt[];
}