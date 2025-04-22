import { leveling } from '../leveling'
import { InterfaceItemGenerator, SelectedOpt } from './Interfaces/ItemGenerator.jsx'
import { armorRules, ArmorStatKey } from '../rules/armorRules'
import { itemsInfo } from '../rules/itemsInfo'
import { translateMap } from '../rules/translateMap'

export const armorGenerator = (playerLevel: number): InterfaceItemGenerator => {
    const rarity = getRandomRarity()
    const optsCount = itemsInfo.rarity_table[rarity]
    const selectedOpts: SelectedOpt[] = []
    const model = getRandomArmorPart()

    for (let i = 1; i <= optsCount; i++) {
        const optKey = `opt_${i}`

        if (typeof armorRules[optKey] !== "function") {
            continue
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

const getRandomOption = (arr: ArmorStatKey[]): ArmorStatKey => {
    return arr[Math.floor(Math.random() * arr.length)]
}

const getRandomArmorPart = (): string => {
    const randomValue = Math.floor(Math.random() * 5) + 1
    return Object.keys(itemsInfo.armor_parts).find(
        key => itemsInfo.armor_parts[key] === randomValue
    )!
}

const getRandomOptAndRemove = (optKey: string, selectedOpts: SelectedOpt[]): ArmorStatKey[] => {
    const availableOpts = armorRules[optKey]() as ArmorStatKey[]

    return availableOpts.filter(
        (opt) => !selectedOpts.some(sel => sel.description === translateArmor(opt))
    )
}

const rollDice = (): string => {
    const diceOptions = ["D4", "D6", "D10", "D12"]
    return diceOptions[Math.floor(Math.random() * diceOptions.length)]
}

const translateArmor = (key: ArmorStatKey): string => {
    return translateMap.armor[key] || "Desconhecido"
}
