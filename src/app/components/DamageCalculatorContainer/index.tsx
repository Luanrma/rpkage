import styled from "styled-components";

const Container = styled.div`
    display: flex;
    margin: 0 auto;
    background-color: #1e1e1e;
    border-radius: 10px;
    color: white;
    padding: 2rem;
    align-items: center;
    justify-content: center;
`;

export default function DamageCalculatorContainer() {
  return (
    <Container>
        <div>
            <h2>Damage Calculator</h2>
            <p>Aqui você poderá calcular o dano causado por armas, habilidades e buffs.</p>
            <p>(Em breve... ⚔️🔥)</p>
        </div>
    </Container>
  );
}
