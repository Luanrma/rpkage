import { levelingResolver } from "../levelingResolver"; 
import { InterfaceItemGenerator, SelectedOpt } from "./Interfaces/ItemGenerator";

export const bricsGenerator = (playerLevel: number): InterfaceItemGenerator => {  
    const selectedOpts: SelectedOpt[] = []     
    return {
        type: "brics",
        rarity: "common",
        model: getBricsByLevel(playerLevel),
        options: selectedOpts
    }
}


const getBricsByLevel = (playerLevel: number): string => {
    const brics = levelingResolver(playerLevel);
    return brics.toString()
}