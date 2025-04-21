'use client'

import styled from "styled-components";
import PlayerInfo from "../PlayerInfo";
import DropDownButton from "../DropDownButton";
import { useState } from "react";
import { Button } from "../Button";
import { InterfaceItemGenerator } from "@/engine/ItemGenerators/Interfaces/ItemGenerator";
import ItemCard from "../ItemCard";
import itemGenerator, { ItemType } from "@/engine/ItemGenerators/itemGenerator";

const ItemGeneratorContainerStyle = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;

  h1 {
    margin-bottom: 20px;
  }
`;

export default function ItemGeneratorContainer({ children }: { children: React.ReactNode }) {
  const [level, setLevel] = useState(1);
  const [lastDroppedItem, setLastDroppedItem] = useState<InterfaceItemGenerator | null>(null);

  const handleSelectItemType = (type: ItemType) => {
    const result = itemGenerator.generateItem(type, level);
    console.log("Item gerado:", result);
    setLastDroppedItem(result);
  };

  return (
    <ItemGeneratorContainerStyle>
      <h1>Item Generator RPG</h1>
      <PlayerInfo onLevelChange={setLevel} />
      <DropDownButton onSelectItemType={handleSelectItemType}/>
      <Button $backgroundColor="#1ee603" $textColor="#000"> Gerar Itens </Button>
      <Button $backgroundColor="#ebc418" $textColor="#000"> Resetar Itens </Button>
      {lastDroppedItem && (
        <div>
          <h3>Último item dropado:</h3>
          <ItemCard 
            title={`${lastDroppedItem?.type.toLocaleUpperCase() || "WIP"}`}
            description={lastDroppedItem?.type || ""} 
            value={`X ${lastDroppedItem?.value || ""}`}
          />
        </div>
      )}
      {children}
    </ItemGeneratorContainerStyle>
  );
}
