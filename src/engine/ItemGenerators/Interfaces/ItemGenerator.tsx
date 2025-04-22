import { translateMap } from "../../rules/translateMap"

export type WeaponItemTranslateMap = keyof typeof translateMap.weapon;
export type ArmorItemTranslateMap = keyof typeof translateMap.armor;
export type OrbItemTranslateMap = keyof typeof translateMap.orb;
export type PotionItemTranslateMap = keyof typeof translateMap.potion;
export type SpecialItemItemTranslateMap = keyof typeof translateMap.special_item;

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