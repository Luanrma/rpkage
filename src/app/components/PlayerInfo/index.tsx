import { useState } from "react";
import styled from "styled-components";

const PlayerInfoStyle = styled.div`
  background-color: #383838;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 600;
    color: #e7e7e7;
    font-size: 1rem;
  }

  input[type="number"] {
    width: 100%;
    padding: .5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1.5rem;
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
`;

interface PlayerInfoProps {
	onLevelChange: (level: number) => void;
	onItemCountChange: (count: number) => void;
}

export default function PlayerInfo({ onLevelChange, onItemCountChange }: PlayerInfoProps) {
	const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputNumberOfItems = e.target?.value
		if (!inputNumberOfItems) {
			return
		}

		const newLevel = parseInt(inputNumberOfItems, 10);
		onLevelChange(newLevel);
	};

	const handleItemCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputNumberOfItems = e.target?.value
		if (!inputNumberOfItems) {
			return
		}
		onItemCountChange(parseInt(inputNumberOfItems));
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
			/>
			<label id="itemCountLabel" htmlFor="itemCount">Number of items (1 to 10): </label>
			<input
				type="number"
				id="itemCount"
				min="1"
				max="10"
				onChange={handleItemCountChange}
			/>
		</PlayerInfoStyle>
	);
}
