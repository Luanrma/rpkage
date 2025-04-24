import { InterfaceItemGenerator } from "./Interfaces/ItemGenerator";

export const specialItemGenerator = (): InterfaceItemGenerator => {
    return {
        type: "Item Especial",
        rarity: "uncommon",
        model: "Item Especial",
        options: []
    };
}