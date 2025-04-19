'use client'

import styled from "styled-components";
import PlayerInfo from "../PlayerInfo";
import DropDownButton from "../DropDownButton";
import { useState } from "react";
import { Button } from "../Button";

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

  return (
    <ItemGeneratorContainerStyle>
      <h1>Item Generator RPG</h1>
      <PlayerInfo onLevelChange={setLevel} />
      <DropDownButton level={level} />
      <Button $backgroundColor="#1ee603" $textColor="#000"> Gerar Itens </Button>
      <Button $backgroundColor="#ebc418" $textColor="#000"> Resetar Itens </Button>

      {children}
    </ItemGeneratorContainerStyle>
  );
}
