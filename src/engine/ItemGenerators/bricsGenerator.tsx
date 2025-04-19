import { armorAndWeaponsStatusGeneratorByLevel } from "../leveling"; 
import { InterfaceItemGenerator } from "./Interfaces/ItemGenerator";

export default {
    generateItem: function (playerLevel: number): InterfaceItemGenerator {       
        return {
            type: "brics",
            rarity: "common",
            value: this.getBricsByLevel(playerLevel),
            options: []
        };
    },

    getBricsByLevel: function (playerLevel: number): string {
        const brics = armorAndWeaponsStatusGeneratorByLevel(playerLevel) * 2;
        return brics.toString()
    }

};