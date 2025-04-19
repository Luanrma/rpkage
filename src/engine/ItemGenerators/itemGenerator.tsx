import bricsGenerator from "./bricsGenerator";
import { InterfaceItemGenerator } from "./Interfaces/ItemGenerator";

// Define os tipos possíveis pra evitar erro de digitação
export type ItemType = "armor" | "weapon" | "orb" | "potion" | "special_item" | "brics";



export default {
    generateItem: function (type: ItemType, playerLevel: number): InterfaceItemGenerator | null {
        const generators: Record<ItemType, () => any> = {
            armor: () => "armorGenerator.generateItem(playerLevel),",
            weapon: () => "weaponGenerator.generateItem(playerLevel),",
            orb: () => "orbGenerator.generateItem(),",
            potion: () => "potionGenerator.generateItem(playerLevel),",
            special_item: () => "specialItemGenerator.generateItem(),",
            brics: () => bricsGenerator.generateItem(playerLevel),
        };

        const generator = generators[type];
        if (!generator) {
            alert(`Error! Item type: ${type} unknown`);
            return null;
        }

        return generator();
    }
};
