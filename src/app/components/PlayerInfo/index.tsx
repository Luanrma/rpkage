import { useState } from "react";
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
    max-width: 90%;
    padding: 12px;

    input[type="number"] {
      font-size: 1.5rem;
      padding: .5rem;
    }
`;

interface PlayerInfoProps {
    onLevelChange: (level: number) => void;
    onItemCountChange: (count: number) => void;
}

export default function PlayerInfo({ onLevelChange, onItemCountChange }: PlayerInfoProps) {
  const [level, setLevel] = useState(1);
  const [itemCount, setItemCount] = useState(1);
  
  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(e.target.value, 10);
    setLevel(newLevel);
    onLevelChange(newLevel);
  };

  const handleItemCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    setItemCount(count);
    onItemCountChange(count);
  };

  return (
      <PlayerInfoStyle>
          <label htmlFor="playerLevel">Player level</label>
          <input
              type="number"
              id="playerLevel"
              min="1"
              max="60"
              value={level}
              onChange={handleLevelChange}
          />
          <label id="itemCountLabel" htmlFor="itemCount">Number of items (1 to 10): </label>
          <input
            type="number"
            id="itemCount"
            min="1"
            max="10"
            value={itemCount}
            onChange={handleItemCountChange}
          />
      </PlayerInfoStyle>
  );
}
