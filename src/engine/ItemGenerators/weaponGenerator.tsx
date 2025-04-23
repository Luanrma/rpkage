import { leveling } from '../leveling';
import { InterfaceItemGenerator, SelectedOpt } from './Interfaces/ItemGenerator';
import { weaponRules } from '../rules/weaponRules';
import { itemsInfo } from '../rules/itemsInfo';
import { translateMap } from '../rules/translateMap';


export const weaponGenerator = (playerLevel: number): InterfaceItemGenerator => {
    const rarity = getRandomRarity();
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
    };
};

const getRandomRarity = (): string => {
    const roll = Math.floor(Math.random() * 100) + 1;

    switch (true) {
        case roll <= 35: return "common";
        case roll <= 60: return "uncommon";
        case roll <= 80: return "rare";
        case roll <= 93: return "epic";
        case roll <= 100: return "legendary";
        default: return "common";
    }
};

const getRandomOption = (arr: string[]): string => {
    return arr[Math.floor(Math.random() * arr.length)];
};

const getRandomOptAndRemove = (optKey: string, selectedOpts: SelectedOpt[]): string[] => {
    const availableOpts = weaponRules[optKey]() as string[]

    return availableOpts.filter(
        (opt) => !selectedOpts.some(sel => sel.description === translateWeapon(opt))
    )
}

const getRandomWeaponType = (): string => {
    const randomValue = Math.floor(Math.random() * 16) + 1;
    const value = Object.keys(itemsInfo.weapon_types)
        .find(k => itemsInfo.weapon_types[k] === randomValue)

    return value as string
  };

const rollDice = (): string => {
    const diceOptions = ["D4", "D6", "D10", "D12"];
    return diceOptions[Math.floor(Math.random() * diceOptions.length)];
};

const translateWeapon = (key: string): string => {
    return translateMap.weapon[key] || "Desconhecido";
};

const translateWeaponModel = (key: string): string => {
    return translateMap.weaponTranslations[key] || "Desconhecido";
};
