import { leveling } from '../leveling';
import { InterfaceItemGenerator, SelectedOpt } from './Interfaces/ItemGenerator';
import { weaponRules } from '../rules/weaponRules';
import { itemsInfo } from '../rules/itemsInfo';
import { translateMap } from '../rules/translateMap';
import randomRarityGenerator from '../utils/randomRarityGenerator';

export const weaponGenerator = (playerLevel: number): InterfaceItemGenerator => {
    const rarity = randomRarityGenerator.getRandomRarity()
    const optsCount = itemsInfo.rarity_table[rarity];
    const selectedOpts: SelectedOpt[] = [];
    const model = translateWeaponModel(getRandomWeaponType());

    for (let i = 1; i <= optsCount; i++) {
        const optKey = `opt_${i}`;

        if (typeof weaponRules[optKey] !== "function") {
            continue;
        }

        const availableOpts = getRandomOptAndRemove(optKey, selectedOpts)

        if (availableOpts.length === 0) {
            continue;
        }

        const randomOpt = getRandomOption(availableOpts);
        const statusItem = ` + ${leveling(playerLevel)}`;
        const diceBonus = randomOpt.includes("plus_dice") ? rollDice() : "";

        selectedOpts.push({
            description: translateWeapon(randomOpt),
            status: statusItem,
            diceBonus: diceBonus
        });
    }

    return {
        type: "weapon",
        model: model,
        rarity,
        options: selectedOpts
    }
}

const getRandomOption = (availableOpts: string[]): string => {
    return availableOpts[Math.floor(Math.random() * availableOpts.length)];
}

const getRandomOptAndRemove = (optKey: string, selectedOpts: SelectedOpt[]): string[] => {
    const availableOpts = weaponRules[optKey]() as string[]

    return availableOpts.filter(opt => 
        !selectedOpts.some(selectedOpt => 
            selectedOpt.description === opt))
}

const getRandomWeaponType = (): string => {
    const randomValue = Math.floor(Math.random() * 16) + 1
    const weapon_types = Object.keys(itemsInfo.weapon_types)
    const value = weapon_types.find(key => itemsInfo.weapon_types[key] === randomValue)

    return value as string
}

const rollDice = (): string => {
    const diceOptions = ["D4", "D6", "D10", "D12"];
    return diceOptions[Math.floor(Math.random() * diceOptions.length)];
}

const translateWeapon = (key: string): string => {
    return translateMap.weapon[key] || "Desconhecido";
}

const translateWeaponModel = (key: string): string => {
    return translateMap.weaponTranslations[key] || "Desconhecido";
} 