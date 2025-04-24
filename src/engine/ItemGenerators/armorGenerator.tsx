import { leveling } from '../leveling'
import { InterfaceItemGenerator, SelectedOpt } from './Interfaces/ItemGenerator.jsx'
import { armorRules } from '../rules/armorRules'
import { itemsInfo } from '../rules/itemsInfo'
import { translateMap } from '../rules/translateMap'
import randomRarityGenerator from '../utils/randomRarityGenerator'

export const armorGenerator = (playerLevel: number): InterfaceItemGenerator => {
    const rarity = randomRarityGenerator.getRandomRarity()
    const optsCount = itemsInfo.rarity_table[rarity]
    const selectedOpts: SelectedOpt[] = []
    const model = getRandomArmorPart()

    for (let i = 1; i <= optsCount; i++) {
        const optKey = `opt_${i}`

        if (typeof armorRules[optKey] !== "function") {
            continue;
        }

        const availableOpts = getRandomOptAndRemove(optKey, selectedOpts)

        if (availableOpts.length === 0) {
            continue
        }

        const randomOpt = getRandomOption(availableOpts)
        const statusItem = ` + ${leveling(playerLevel)}`

        selectedOpts.push({
            description: translateArmor(randomOpt),
            status: statusItem,
            diceBonus: ""
        })
    }

    return {
        type: "armor",
        rarity: rarity,
        model: model,
        options: selectedOpts
    }
}

const getRandomOption = (arr: string[]): string => {
    return arr[Math.floor(Math.random() * arr.length)]
}

const getRandomArmorPart = (): string => {
    const randomValue = Math.floor(Math.random() * 5) + 1
    return Object.keys(itemsInfo.armor_parts).find(
        key => itemsInfo.armor_parts[key] === randomValue
    )!
}

const getRandomOptAndRemove = (optKey: string, selectedOpts: SelectedOpt[]): string[] => {
    const availableOpts = armorRules[optKey]() as string[]

    return availableOpts.filter((opt) =>
        !selectedOpts.some( sel => 
            sel.description === translateArmor(opt)))
}

const translateArmor = (key: string): string => {
    return translateMap.armor[key] || "Desconhecido"
}