import { generateRandomNumberWithMinAndMaxRange } from "../utils/utils";
import { translateMap } from '../rules/translateMap';
import { InterfaceItemGenerator } from "./Interfaces/ItemGenerator";
import { levelingResolver } from "../levelingResolver";

interface Potion {
    range: Array<number>
    rarity: string
    name: string,
    value: string
}

export const potionGenerator = (playerLevel: number): InterfaceItemGenerator => {
    const roll = generateRandomNumberWithMinAndMaxRange(1, 100);
    const potionDrop = potionDrops(playerLevel).find(potion => roll >= potion.range[0] && roll <= potion.range[1]) as Potion;
    const potionName = translatePotion(potionDrop.name)
    return {
        name: potionName,
        type: "potion",
        rarity: potionDrop.rarity,
        slot: "potion",
        attributes: [{ description: potionName, status: potionDrop.value, diceBonus: "" }]
    };
}

const potionDrops = (playerLevel: number): Potion[] => [
    { range: [1, 20],   rarity: "commom", name: "hp_potion",      value: ` + ${5  + levelingResolver(playerLevel)}` },
    { range: [21, 40],  rarity: "commom", name: "mp_potion",      value: ` + ${5  + levelingResolver(playerLevel)}` },
    { range: [41, 55],  rarity: "commom", name: "lunchbox",       value: ` + ${10 + levelingResolver(playerLevel)}` },
    { range: [56, 64],  rarity: "rare",   name: "heal_potion",    value: "" },
    { range: [65, 73],  rarity: "rare",   name: "full_mp_potion", value: "" },
    { range: [74, 82],  rarity: "rare",   name: "full_hp_potion", value: "" },
    { range: [83, 100], rarity: "epic",   name: "special_potion", value: "" },
];

const translatePotion = (key: string): string => {
    return translateMap.potion[key] || "Desconhecido";
}