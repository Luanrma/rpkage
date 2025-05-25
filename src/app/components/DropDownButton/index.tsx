import { useState } from "react"
import styled from "styled-components"
import { Button } from "../Button"
import { ItemType } from "@/engine/ItemGenerators/itemGeneratorFactory"

const DropDownContainer = styled.div`
	position: relative;
	display: inline-block;

	@media (max-width: 600px) {
		width: 100%; /* largura total em telas pequenas */
	}
`

const DropDownMenu = styled.div<{ $isOpen: boolean }>`
	position: absolute;
	background-color: rgba(53, 53, 53, 0.5);
	border-radius: 8px;
	box-shadow: 0 4px 12px #8b3ae0;
	display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
	width: 100%;
	z-index: 1000;

	@media (max-width: 600px) {
		position: static; /* fica abaixo do botão, sem overflow */
		box-shadow: none;
		background-color: transparent;
	}
`

const buttons: { label: string, type: ItemType }[] = [
	{ label: "Weapon", type: "weapon" },
	{ label: "Armor", type: "armor" },
	{ label: "Potion", type: "potion" },
	{ label: "Orb", type: "orb" },
	{ label: "Brics", type: "brics" },
	{ label: "Special Item", type: "special_item" },
]

interface DropDownButtonProps {
	onSelectItemType: (type: ItemType) => void
}

export default function DropDownButton({ onSelectItemType }: DropDownButtonProps) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<DropDownContainer>
			<Button
				onClick={() => setIsOpen(!isOpen)}
				$backgroundColor="#8b3ae0"
				$textColor="#fff"
				style={{width: "90%"}}
			>
				Selecionar
			</Button>

			<DropDownMenu $isOpen={isOpen}>
				{buttons.map((button, index) => (
					<Button
						key={index}
						onMouseDown={() => { onSelectItemType(button.type) }}
						$backgroundColor="#8b3ae0"
						$textColor="#fff"
						style={{width: "90%"}}
					>
						{button.label}
					</Button>
				))}
			</DropDownMenu>
		</DropDownContainer>
	)
}
