import { generateRandomNumberWithMinAndMaxRange } from "../utils/utils";
import { InterfaceItemGenerator } from "./Interfaces/ItemGenerator";
import itemGeneratorFactory, { ItemType } from "./itemGeneratorFactory";

interface ItemDrops {
    range:Array<number>
    type: ItemType
}

export const itemGeneratorRandom = (playerLevel: number): InterfaceItemGenerator => {
    const roll = generateRandomNumberWithMinAndMaxRange(1, 100);

    const itemType = itemDrops.find(
        itemDrop => roll >= itemDrop.range[0] && roll <= itemDrop.range[1]
    ) as ItemDrops;

    return itemGeneratorFactory.generateItem(itemType.type, playerLevel);
}

const itemDrops = [
    { range: [1, 18],   type: 'brics' },
    { range: [21, 40],  type: 'potion' },
    { range: [41, 57],  type: 'armor' },
    { range: [58, 73],  type: 'weapon' },
    { range: [74, 88],  type: 'orb' },
    { range: [89, 100], type: 'special_item' },
];
