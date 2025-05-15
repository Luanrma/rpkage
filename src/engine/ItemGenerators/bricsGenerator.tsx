import { levelingResolver } from "../levelingResolver"; 
import { InterfaceItemGenerator, SelectedOpt } from "./Interfaces/ItemGenerator";

export const bricsGenerator = (playerLevel: number): InterfaceItemGenerator => {  
    const selectedOpts: SelectedOpt[] = []     
    return {
        name: "brics",
        type: "brics",
        rarity: "common",
        slot: "brics",
        attributes: [{ description: "brics x", status: getBricsByLevel(playerLevel), diceBonus: "" }]
    }
}

const getBricsByLevel = (playerLevel: number): string => {
    const brics = levelingResolver(playerLevel);
    return brics.toString()
}