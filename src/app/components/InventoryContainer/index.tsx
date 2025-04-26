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

`;

export default function InventoryContainer() {
  return (
    <Container>
        <div>
            <h2>Inventory em construção 🛠️</h2>
            <p>Aqui você poderá organizar suas tralhas.</p>
            <p>(Em breve... 🎒)</p>
        </div>
    </Container>
  );
}