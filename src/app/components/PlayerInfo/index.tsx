import styled from "styled-components";

const PlayerInfoStyle = styled.div`
  background: linear-gradient(145deg, #1a1a1a, #2c2c2c);
  border: 2px solid #4a2f14;
  border-radius: 16px;
  padding: 1.25rem 2rem;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;
  max-width: 460px;
  font-size: 1.15rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #e6e6e6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7), inset 0 0 10px rgba(74, 47, 20, 0.3);
  user-select: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  font-family: 'Cinzel', serif;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.9), inset 0 0 12px rgba(74, 47, 20, 0.4);
  }

  label {
    font-weight: 600;
    color: #c0a98e;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
  }

  input[type="number"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #4a2f14;
    border-radius: 12px;
    font-size: 1.3rem;
    text-align: center;
    box-sizing: border-box;
    background-color: #1a1a1a;
    color: #d4af37;
    font-family: 'Cinzel', serif;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  input[type="number"]:focus {
    border-color: #d4af37;
    box-shadow: 0 0 8px rgba(212, 175, 55, 0.7);
    outline: none;
  }
`;

interface PlayerInfoProps {
  onLevelChange: (level: number) => void;
  onItemCountChange: (count: number) => void;
}

export default function PlayerInfo({ onLevelChange, onItemCountChange }: PlayerInfoProps) {
  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    onLevelChange(parseInt(value, 10));
  };

  const handleItemCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    onItemCountChange(parseInt(value, 10));
  };

  return (
    <PlayerInfoStyle>
      <label htmlFor="playerLevel">Player level</label>
      <input
        type="number"
        id="playerLevel"
        min="1"
        max="60"
        onChange={handleLevelChange}
        defaultValue={1}
      />
      <label htmlFor="itemCount">Number of items (1 to 10):</label>
      <input
        type="number"
        id="itemCount"
        min="1"
        max="10"
        onChange={handleItemCountChange}
        defaultValue={1}
      />
    </PlayerInfoStyle>
  );
}
