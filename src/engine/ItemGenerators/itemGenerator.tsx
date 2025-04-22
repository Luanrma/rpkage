import { armorGenerator } from "./armorGenerator";
import { bricsGenerator } from "./bricsGenerator";
import { InterfaceItemGenerator } from "./Interfaces/ItemGenerator";
import { weaponGenerator } from "./weaponGenerator";

export type ItemType = "armor" | "weapon" | "orb" | "potion" | "special_item" | "brics";

export default {
    generateItem: function (type: ItemType, playerLevel: number): InterfaceItemGenerator | null {
        const generators: Record<ItemType, () => any> = {
            armor: () => armorGenerator(playerLevel),
            weapon: () => weaponGenerator(playerLevel),
            orb: () => null,
            potion: () => null,
            special_item: () => null,
            brics: () => bricsGenerator(playerLevel),
        };

        const generator = generators[type];
        if (!generator) {
            alert(`Error! Item type: ${type} unknown`);
            return null;
        }

        return generator();
    }
};
