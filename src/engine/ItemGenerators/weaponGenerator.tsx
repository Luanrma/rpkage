import { leveling } from '../leveling';
import { InterfaceItemGenerator, SelectedOpt } from './Interfaces/ItemGenerator';
import { weaponRules } from '../rules/weaponRules';
import { itemsInfo } from '../rules/itemsInfo';
import { translateMap } from '../rules/translateMap';

type WeaponStatKey = keyof typeof translateMap.weapon;
type WeaponTranslationStatKey = keyof typeof translateMap.weaponTranslations;

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

        const availableOpts = (weaponRules[optKey]() as WeaponStatKey[])
            .filter(opt => !selectedOpts.some(sel => sel.description === translateWeapon(opt)));

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

const getRandomOption = (arr: WeaponStatKey[]): WeaponStatKey => {
    return arr[Math.floor(Math.random() * arr.length)];
};

const getRandomWeaponType = (): WeaponTranslationStatKey => {
    const randomValue = Math.floor(Math.random() * 16) + 1;
    return Object.keys(itemsInfo.weapon_types)
        .find(k => itemsInfo.weapon_types[k] === randomValue) as WeaponTranslationStatKey;
  };

const rollDice = (): string => {
    const diceOptions = ["D4", "D6", "D10", "D12"];
    return diceOptions[Math.floor(Math.random() * diceOptions.length)];
};

const translateWeapon = (key: WeaponStatKey): string => {
    return translateMap.weapon[key] || "Desconhecido";
};

const translateWeaponModel = (key: WeaponTranslationStatKey): string => {
    return translateMap.weaponTranslations[key] || "Desconhecido";
};
