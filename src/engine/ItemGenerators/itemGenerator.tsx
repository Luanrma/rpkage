import bricsGenerator from "./bricsGenerator";
import { InterfaceItemGenerator } from "./Interfaces/ItemGenerator";

// Define os tipos possíveis pra evitar erro de digitação
export type ItemType = "armor" | "weapon" | "orb" | "potion" | "special_item" | "brics";

export default {
    generateItem: function (type: ItemType, playerLevel: number): InterfaceItemGenerator | null {
        const generators: Record<ItemType, () => any> = {
            armor: () => null,
            weapon: () => null,
            orb: () => null,
            potion: () => null,
            special_item: () => null,
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
