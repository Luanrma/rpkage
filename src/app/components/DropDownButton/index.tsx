'use client';

import { useState } from "react";
import styled from "styled-components";
import { Button } from "../Button";

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

const buttons = [
	"Drop Weapon", "Drop Armor", "Drop Potion",
	"Drop Orb", "Drop BRICS", "Drop Special Item"
];

export default function DropDownButton() {
	const [isOpen, setIsOpen] = useState(false);

	return (
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
						$backgroundColor="#3b82f6"
						$textColor="#fff"
					>
						{button}
					</Button>
				))}
			</DropDownMenu>
		</DropDownContainer>
	);
}
