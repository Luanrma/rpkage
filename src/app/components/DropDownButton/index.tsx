import { useState } from "react"
import styled from "styled-components"
import { Button } from "../Button"
import { ItemType } from "@/engine/ItemGenerators/itemGeneratorFactory"

const DropDownContainer = styled.div`
	position: relative;
	display: inline-block;
`

const DropDownMenu = styled.div<{ $isOpen: boolean }>`
	position: absolute;
	background-color: #353535;
	border-radius: 8px;
	width: 100%;
	box-shadow: 0 4px 12px #2563eb;
	display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`

const buttons: { label: string, type: ItemType }[] = [
	{ label: "Weapon",       type: "weapon" },
	{ label: "Armor",        type: "armor" },
	{ label: "Potion",       type: "potion" },
	{ label: "Orb",          type: "orb" },
	{ label: "Brics",        type: "brics" },
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
				$backgroundColor="#3b82f6"
				$textColor="#fff"
			>
				Selecionar
			</Button>

			<DropDownMenu $isOpen={isOpen}>
				{buttons.map((button, index) => (
					<Button
						key={index}
						onMouseDown={() => { onSelectItemType(button.type) }}
						$backgroundColor="#3b82f6"
						$textColor="#fff"
					>
						{button.label}
					</Button>
				))}
			</DropDownMenu>
		</DropDownContainer>
	)
}
