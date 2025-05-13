'use client'

import styled from "styled-components";
import PlayerInfo from "@/app/components/PlayerInfo";
import DropDownButton from "@/app/components/DropDownButton";
import { useState } from "react";
import { Button } from "@/app/components/Button";
import { InterfaceItemGenerator } from "@/engine/ItemGenerators/Interfaces/ItemGenerator";
import ItemCard from "@/app/components/ItemCard";
import itemGeneratorFactory, { ItemType } from "@/engine/ItemGenerators/itemGeneratorFactory";
import { itemGeneratorRandom } from "@/engine/ItemGenerators/itemGeneratorRandom";

const ItemGeneratorContainerStyle = styled.div`
	display: flex;
	margin: 0 auto;
	flex-direction: column;
	align-items: center;
	width: 100%;

	.buttons-style {
		margin: 1rem 1rem 1rem 1rem;
		display:flex;
		z-index: 10;
	}

	.items-drop {
		margin-top: 1rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
	}
`;

export default function ItemGeneratorContainer() {
	const [playerLevel, setPlayerLevel] = useState(1);
	const [droppedItems, setDroppedItems] = useState<InterfaceItemGenerator[]>([]);
	const [itemCount, setItemCount] = useState(1);

	const handleSelectItemType = (type: ItemType) => {
		const result = itemGeneratorFactory.generateItem(type, playerLevel);
		setDroppedItems((prevItems) => [...prevItems, result]);
	};

	const handleGenerateRandomItems = () => {
		const newItems: InterfaceItemGenerator[] = [];

		for (let i = 0; i < itemCount; i++) {
			const generated = itemGeneratorRandom(playerLevel);
			newItems.push(generated);
		}

		setDroppedItems((prev) => [...prev, ...newItems]);
	};

	const handleResetItems = () => setDroppedItems([])

	return (
		<ItemGeneratorContainerStyle>
			<PlayerInfo onLevelChange={setPlayerLevel} onItemCountChange={setItemCount} />
			<div className="buttons-style">
				<DropDownButton onSelectItemType={handleSelectItemType} />
				<Button $backgroundColor="#1ee603" $textColor="#000" onClick={handleGenerateRandomItems}> Gerar </Button>
				<Button $backgroundColor="#ebc418" $textColor="#000" onClick={handleResetItems}> Resetar </Button>			
			</div>

			<div className="items-drop">
				{droppedItems.map((item, index) => (
					<ItemCard 
						key={index}
						name={item.name}
						type={item.type}
						rarity={item.rarity}
						slot={item.slot}
						attributes={item.attributes}
					/>
				))}
			</div>
		</ItemGeneratorContainerStyle>
	);
}