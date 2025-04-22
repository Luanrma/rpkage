import { leveling } from "../leveling"; 
import { InterfaceItemGenerator, SelectedOpt } from "./Interfaces/ItemGenerator";

export const bricsGenerator = (playerLevel: number): InterfaceItemGenerator => {  
    const selectedOpts: SelectedOpt[] = []     
    return {
        type: "brics",
        rarity: "common",
        value: getBricsByLevel(playerLevel),
        options: selectedOpts
    }
}


const getBricsByLevel = (playerLevel: number): string => {
    const brics = leveling(playerLevel) * 2;
    return brics.toString()
}