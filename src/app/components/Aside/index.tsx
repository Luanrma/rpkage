import { useState, useRef, RefObject } from "react";
import styled from "styled-components";
import { Activity, Swords, SquareArrowOutDownLeft, SquareArrowOutUpRight, Backpack } from "lucide-react";
import dragAndDrop from "@/app/utils/dragAndDrop";

const AsideContainer = styled.div<{ $collapsed: boolean }>`
  position: absolute;
  top: 0.4rem;
  left: 0.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(49, 49, 49);
  padding: 1rem;
  width: ${({ $collapsed }) => ($collapsed ? "3.5rem" : "15rem")};
  height: auto;
  border-radius: 10px;
  transition: width 0.3s ease;
  color: white;
  z-index: 1;
  cursor: grab;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0 1rem 0;
  cursor: pointer;
  color: rgb(117, 117, 117);

  &:hover {
    color: rgb(255, 255, 255);
    transform: translateX(5px);
  }

  svg {
    flex-shrink: 0;
  }
`;

const ToggleButton = styled.button<{ $collapsed: boolean }>`
  align-self: ${({ $collapsed }) => ($collapsed ? "center" : "flex-end")};
  margin-bottom: 1rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

interface AsideProps {
	changeSection: (value: string) => void;
}

export default function Aside({ changeSection }: AsideProps) {
	const [collapsed, setCollapsed] = useState(true)
	const asideRef = useRef<HTMLDivElement>(null)

	const handleMenuItemClick = (value: string) => changeSection(value)

	return (
		<AsideContainer
			ref={asideRef}
			$collapsed={collapsed}
			onMouseDown={(e) => dragAndDrop(asideRef, e)}
			onTouchStart={(e) => dragAndDrop(asideRef, e)}
		>
			<ToggleButton onClick={() => setCollapsed(!collapsed)} $collapsed={collapsed}>
				{collapsed ? <SquareArrowOutUpRight /> : <SquareArrowOutDownLeft />}
			</ToggleButton>

			<MenuList>
				<MenuItem onClick={() => handleMenuItemClick("Item Generator")}>
					<Swords />
					{!collapsed && "Item Generator"}
				</MenuItem>
				<MenuItem onClick={() => handleMenuItemClick("Damage Calculator")}>
					<Activity />
					{!collapsed && "Damage Calculator"}
				</MenuItem>
				<MenuItem onClick={() => handleMenuItemClick("Inventory")}>
					<Backpack />
					{!collapsed && "Inventory"}
				</MenuItem>
			</MenuList>
		</AsideContainer>
	);
}
