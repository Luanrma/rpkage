import styled from "styled-components";
import ItemCard from "../ItemCard";

// Estilos
const ItemDetailContainer = styled.div`
    position: fixed;
    padding: 1rem 0 0 2rem;
`;

type ItemAttributes = {
    dice: string;
    status: string;
    description: string;
};

type ItemDefinition = {
    type: string;
};

type ItemDetail = {
    id: string;
    campaingId: string;
    type: string;
    rarity: string;
    description: string;
    attributes: {
        opt_1: ItemAttributes | null;
        opt_2: ItemAttributes | null;
        opt_3: ItemAttributes | null;
        opt_4: ItemAttributes | null;
        definition: ItemDefinition;
    };
};

type InventoryItem = {
    id: bigint;
    inventoryId: bigint;
    itemsId: bigint;
    createdAt: Date;
    updatedAt: Date;
    item: ItemDetail;
};

interface InventoryModalItemDetailsProps {
    inventoryItem: InventoryItem;
    onInventoryChange: () => void;
}

export default function InventoryModalItemDetails({ inventoryItem, onInventoryChange }: InventoryModalItemDetailsProps) {
    // Filtrando os atributos para passar para o ItemCard
    const options = Object.keys(inventoryItem.item.attributes)
        .filter(key => key !== 'definition' && inventoryItem.item.attributes[key as keyof typeof inventoryItem.item.attributes])
        .map(key => inventoryItem.item.attributes[key as keyof typeof inventoryItem.item.attributes]);

    // Garantindo que as opções passadas para o ItemCard são de tipo ItemAttributes
    const filteredOptions = options.filter(option => option && 'description' in option) as ItemAttributes[];

    return (
        <ItemDetailContainer>
            <ItemCard
                id={Number(inventoryItem.item.id)}
                inventoryItemId={Number(inventoryItem.id)}
                name=""
                type={inventoryItem.item.type}
                rarity={inventoryItem.item.rarity}
                slot={inventoryItem.item.type}
                attributes={filteredOptions}
                onTransactionComplete={onInventoryChange}
            />
        </ItemDetailContainer>
    );
}
