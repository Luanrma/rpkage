'use client'

import { SpinningDice } from "@/app/components/SpinningDice";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    width: 80vw;
    margin: 0 auto;
    background-color: #1e1e1e;
    border-radius: 10px;
    color: white;
    padding: 2rem;
    align-items: center;
    justify-content: center;

    .damage-container {
    }
`;

export default function DamageCalculatorContainer() {
  return (
    <Container>
        <SpinningDice sides={20} />
    </Container>
  );
}
