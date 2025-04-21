import { useState } from "react";
import styled from "styled-components";
import { Button } from "../Button";
import { ItemType } from "@/engine/ItemGenerators/itemGenerator";

const DropDownContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
`;

const DropDownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 110%;
  left: 0;
  background-color: #353535;
  border-radius: 8px;
  min-width: 220px;
  box-shadow: 0 4px 12px #2563eb;
  z-index: 1;
  padding: 10px 0;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(-10px)')};
  transition: opacity 0.3s ease, transform 0.3s ease;
`;

const buttons: { label: string, type: ItemType }[] = [
	{ label: "Drop Weapon", type: "weapon" },
	{ label: "Drop Armor", type: "armor" },
	{ label: "Drop Potion", type: "potion" },
	{ label: "Drop Orb", type: "orb" },
	{ label: "Drop BRICS", type: "brics" },
	{ label: "Drop Special Item", type: "special_item" },
];

interface DropDownButtonProps {
	onSelectItemType: (type: ItemType) => void;
}

export default function DropDownButton({ onSelectItemType  }: DropDownButtonProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<DropDownContainer>
				<Button
					onClick={() => setIsOpen(!isOpen)}
					$backgroundColor="#3b82f6"
					$textColor="#fff"
				>
					Selecionar Drop
				</Button>

				<DropDownMenu $isOpen={isOpen}>
					{buttons.map((button, index) => (
						<Button
							key={index}
							onMouseDown={(e) => {
								e.preventDefault(); // evita fechar o menu
								onSelectItemType(button.type);
							}}
							$backgroundColor="#3b82f6"
							$textColor="#fff"
						>
							{button.label}
						</Button>
					))}
				</DropDownMenu>
			</DropDownContainer>
		</>
	);
}
