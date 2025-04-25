import { levelingResolver } from '../levelingResolver'
import { InterfaceItemGenerator, SelectedOpt } from './Interfaces/ItemGenerator'
import { weaponRules } from '../rules/weaponRules'
import { itemsInfo } from '../rules/itemsInfo'
import { translateMap } from '../rules/translateMap'
import randomRarityGenerator from '../utils/randomRarityGenerator'
import { generateRandomNumberWithMinAndMaxRange } from '../utils/utils'

export const weaponGenerator = (playerLevel: number): InterfaceItemGenerator => {
    const rarity = randomRarityGenerator.getRandomRarity()
    const optsCount = itemsInfo.rarity_table[rarity]
    const selectedOpts: SelectedOpt[] = []
    const weaponType = getRandomWeaponType()

    for (let i = 1; i <= optsCount; i++) {
        const optKey = `opt_${i}`

        if (typeof weaponRules[optKey] !== "function") {
            continue
        }

        const availableOpts = getRandomOptAndRemove(optKey, selectedOpts)

        if (availableOpts.length === 0) {
            continue
        }

        const randomOpt = getRandomOption(availableOpts)
        const statusItem = statusSelectedOptionCalculator(randomOpt, weaponType, playerLevel)
        const diceBonus = randomOpt.includes("plus_dice") ? rollDice() : ""

        selectedOpts.push({
            description: translateWeapon(randomOpt),
            status: statusItem,
            diceBonus: diceBonus
        });
    }

    return {
        type: "weapon",
        model: translateWeaponModel(weaponType),
        rarity,
        options: selectedOpts
    }
}

const statusSelectedOptionCalculator = (randomOpt: string, weaponType: string, playerLevel: number): string => {
    switch (true) {
        case randomOpt.includes("chance_"): {
            const roll = generateRandomNumberWithMinAndMaxRange(1, 100);
        
            if (roll <= 60) return " + 5%";
            return " + 10%";                 
        }

        case randomOpt.includes("regeneration_per_turn"): {
            const dmgStatus = Math.floor(playerLevel / 5)
            return ` + ${ dmgStatus === 0 ? 1 : dmgStatus }`
        }

        case randomOpt.includes("_steal_"): {
            const dmgStatus = Math.floor(playerLevel / 4)
            return ` + ${ dmgStatus === 0 ? 1 : dmgStatus }`
        }

        case randomOpt.includes("_per_battle"): {
            return ` + 10%`
        }

        case randomOpt.includes("brics_"): {
            return ` + 15%`
        }

        default: { 
            if (weaponType.includes('one_hand')) {
                return ` + ${Math.round(levelingResolver(playerLevel) / 2)}`
            }
            return ` + ${levelingResolver(playerLevel)}`
        }
    }
}

const rollDice = (): string => {
    const roll = generateRandomNumberWithMinAndMaxRange(1, 100);
        
        if (roll <= 40) return " + D4";  // 1–40   → 40%
        if (roll <= 70) return " + D6"; // 41–70  → 30%
        if (roll <= 90) return " + D10"; // 71–90  → 20%
        return " + D12";                 // 91–100 → 10%
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

const translateWeapon = (key: string): string => {
    return translateMap.weapon[key] || "Desconhecido";
}

const translateWeaponModel = (key: string): string => {
    return translateMap.weaponTranslations[key] || "Desconhecido";
} 