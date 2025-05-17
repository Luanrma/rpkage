import { InterfaceItemGenerator } from "./Interfaces/ItemGenerator";

export const specialItemGenerator = (): InterfaceItemGenerator => {
    return {
        name: "Item Especial",
        type: "Item Especial",
        rarity: "uncommon",
        slot: "Item Especial",
         attributes: [{ description: "", status: "", diceBonus: "" }]
    };
}