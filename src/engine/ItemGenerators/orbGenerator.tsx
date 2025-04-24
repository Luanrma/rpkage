import { generateRandomNumberWithMinAndMaxRange } from "@/engine/utils/utils"; 
import { InterfaceItemGenerator } from "./Interfaces/ItemGenerator.jsx";
import { translateMap } from "../rules/translateMap";

interface Orb {
    range: Array<number>
    rarity: string
    orb: string
}

export const orbGenerator = (): InterfaceItemGenerator => {
    const roll = generateRandomNumberWithMinAndMaxRange(1, 100);
    const drop = orbDrops.find(orb => roll >= orb.range[0] && roll <= orb.range[1]) as Orb;
    
    return {
        type: "orb",
        rarity: drop.rarity,
        model: translateOrb(drop.orb),
        options: []
    }
}

const orbDrops = [
    { range: [1, 30], rarity: 'common', orb: 'black_orb' } as Orb,       // 30% de chance para 'black_orb'
    { range: [31, 50], rarity: 'rare', orb: 'green_orb' } as Orb,        // 20% de chance para 'green_orb'
    { range: [51, 70], rarity: 'rare', orb: 'blue_orb' } as Orb,         // 20% de chance para 'blue_orb'
    { range: [71, 85], rarity: 'rare', orb: 'red_orb' } as Orb,          // 15% de chance para 'red_orb'
    { range: [86, 95], rarity: 'epic', orb: 'special_orb' } as Orb,      // 10% de chance para 'special_orb'
    { range: [96, 100], rarity: 'legendary', orb: 'summon_orb' } as Orb, //  5% de chance para 'summon_orb'
]

const translateOrb = (key: string): string => {
    return translateMap.orb[key] || "Desconhecido"
}