import { leveling } from '../leveling'
import { InterfaceItemGenerator, SelectedOpt } from './Interfaces/ItemGenerator.jsx'
import { armorRules, ArmorRulesOptKeys } from '../rules/armorRules'
import { itemsInfo } from '../rules/itemsInfo'
import { translateMap } from '../rules/translateMap'

type ArmorOptKey = keyof ArmorRulesOptKeys;

export const armorGenerator = (playerLevel: number): InterfaceItemGenerator => {
    const rarity = getRandomRarity()
    const optsCount = itemsInfo.rarity_table[rarity]
    const selectedOpts: SelectedOpt[] = []
    const model = getRandomArmorPart()

    for (let i = 1; i <= optsCount; i++) {
        const optKey = `opt_${i}` as ArmorOptKey

        if (!armorRules[optKey]) {
            continue;
        }

        const availableOpts = getRandomOptAndRemove(optKey, selectedOpts)

        if (availableOpts.length === 0) {
            continue
        }

        const randomOpt = getRandomOption(availableOpts)
        const statusItem = ` + ${leveling(playerLevel)}`
        const diceBonus = randomOpt.includes("plus_dice") ? ` + ${rollDice()}` : ""

        selectedOpts.push({
            description: translateArmor(randomOpt),
            status: statusItem,
            diceBonus: diceBonus
        })
    }

    return {
        type: "armor",
        rarity: rarity,
        model: model,
        options: selectedOpts
    }
}

const getRandomRarity = (): string => {
    const roll = Math.floor(Math.random() * 100) + 1;

    switch (true) {
        case roll <= 35: return "common"
        case roll <= 60: return "uncommon"
        case roll <= 80: return "rare"
        case roll <= 93: return "epic"
        case roll <= 100: return "legendary"
        default: return "common"
    }
}

const getRandomOption = (arr: (keyof typeof translateMap.armor)[]): keyof typeof translateMap.armor => {
    return arr[Math.floor(Math.random() * arr.length)]
}

const getRandomArmorPart = (): string => {
    const randomValue = Math.floor(Math.random() * 5) + 1
    return Object.keys(itemsInfo.armor_parts).find(
        key => itemsInfo.armor_parts[key] === randomValue
    )!
}

const getRandomOptAndRemove = (optKey: ArmorOptKey, selectedOpts: SelectedOpt[]): (keyof typeof translateMap.armor)[] => {
    const availableOpts = armorRules[optKey]
    return availableOpts.filter((opt) =>
        !selectedOpts.some(sel => sel.description === translateArmor(opt as keyof typeof translateMap.armor))
    ) as (keyof typeof translateMap.armor)[]
}

const rollDice = (): string => {
    const diceOptions = ["D4", "D6", "D10", "D12"]
    return diceOptions[Math.floor(Math.random() * diceOptions.length)]
}

const translateArmor = (key: keyof typeof translateMap.armor): string => {
    return translateMap.armor[key] || "Desconhecido"
}