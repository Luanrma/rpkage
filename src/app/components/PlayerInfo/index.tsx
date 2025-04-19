import styled from "styled-components";

const PlayerInfoStyle = styled.div`
    background-color: #383838;
    padding: 16px;
    margin: 16px auto;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-family: 'Arial', sans-serif;
    
    label {
        font-weight: 600;
        color: #e7e7e7;
        font-size: 16px;
    }

    input[type="number"] {
        width: 100%;
        padding: 14px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 26px;
        text-align: center;
        box-sizing: border-box;
        transition: border-color 0.3s, box-shadow 0.3s;
        background-color: #1c1c1c;
        color: #fff;
    }

    input[type="number"]:focus {
        border-color: #5c7cfa;
        box-shadow: 0 0 5px rgba(92, 124, 250, 0.4);
        outline: none;
    }

    @media (max-width: 480px) {
        .player-info {
            max-width: 90%;
            padding: 12px;
        }

        .player-info label {
            font-size: 14px;
        }

        .player-info input[type="number"] {
            font-size: 24px;
            padding: 12px;
        }
    }
`;


export default function PlayerInfo() {
    return (
        <PlayerInfoStyle>
            <label htmlFor="playerLevel">Player level</label>
            <input type="number" id="playerLevel" min="1" max="60" defaultValue="1"/>
            <label id="itemCountLabel" htmlFor="itemCount">Number of items (1 to 10): </label>
            <input type="number" id="itemCount" min="1" max="10" defaultValue="1"/>
        </PlayerInfoStyle>
    );
}