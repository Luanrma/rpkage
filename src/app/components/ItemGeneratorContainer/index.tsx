'use client'

import styled from "styled-components";
import PlayerInfo from "../PlayerInfo";
import DropDownButton from "../DropDownButton";
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
    return (
        <ItemGeneratorContainerStyle>
            <h1>Item Generator RPG</h1>
            <PlayerInfo />
            <DropDownButton />
            <Button $backgroundColor="#1ee603" $textColor="#000"> Gerar Itens </Button>
            <Button $backgroundColor="#ebc418" $textColor="#000"> Resetar Itens </Button>

            {children}
        </ItemGeneratorContainerStyle>
    );
}