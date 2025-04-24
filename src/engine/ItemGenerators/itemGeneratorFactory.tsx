import { armorGenerator } from "./armorGenerator";
import { bricsGenerator } from "./bricsGenerator";
import { orbGenerator } from "./orbGenerator";
import { InterfaceItemGenerator } from "./Interfaces/ItemGenerator";
import { weaponGenerator } from "./weaponGenerator";
import { potionGenerator } from "./potionGenerator";
import { specialItemGenerator } from "./specialItemGenerator";

export type ItemType = "armor" | "weapon" | "orb" | "potion" | "special_item" | "brics";

export default {
    generateItem: function (type: ItemType, playerLevel: number): InterfaceItemGenerator {
        const generators: Record<ItemType, () => InterfaceItemGenerator> = {
            armor: () => armorGenerator(playerLevel),
            weapon: () => weaponGenerator(playerLevel),
            orb: () => orbGenerator(),
            potion: () => potionGenerator(playerLevel),
            special_item: () => specialItemGenerator(),
            brics: () => bricsGenerator(playerLevel),
        };

        return generators[type]();
    }
}