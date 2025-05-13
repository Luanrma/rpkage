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

interface InventoryModalItemDetailsProps {
    item: ItemDetail;
}

export default function InventoryModalItemDetails({ item }: InventoryModalItemDetailsProps) {
    // Filtrando os atributos para passar para o ItemCard
    const options = Object.keys(item.attributes)
        .filter(key => key !== 'definition' && item.attributes[key as keyof typeof item.attributes])
        .map(key => item.attributes[key as keyof typeof item.attributes]);

    // Garantindo que as opções passadas para o ItemCard são de tipo ItemAttributes
    const filteredOptions = options.filter(option => option && 'description' in option) as ItemAttributes[];

    return (
        <ItemDetailContainer>
            <ItemCard
                id={Number(item.id)}
                name=""
                type={item.type}
                rarity={item.rarity}
                slot={item.type}
                attributes={filteredOptions}
            />
        </ItemDetailContainer>
    );
}
