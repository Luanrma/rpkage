'use client'

import Link from 'next/link';
import { useState, useRef } from "react";
import styled from "styled-components";
import { Activity, Swords, SquareArrowOutDownLeft, SquareArrowOutUpRight, Backpack, User } from "lucide-react";
import dragAndDrop from "@/app/utils/dragAndDrop";
import LogoutButton from '../LogoutButton';

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

export default function Aside() {
	const [collapsed, setCollapsed] = useState(true)
	const asideRef = useRef<HTMLDivElement>(null)

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
				<MenuItem>
					<Link href="/item-generator"><Swords />{!collapsed && "Item Generator"}</Link>
				</MenuItem>
				<MenuItem >
					<Link href="/damage-calculator"><Activity />{!collapsed && "Damage Calculator"}</Link>
				</MenuItem>
				<MenuItem >
					<Link href="/inventory"><Backpack />{!collapsed && "Inventory"}</Link>
				</MenuItem>
				<MenuItem>
					<Link href="/user"><User />{!collapsed && "User"}</Link>
				</MenuItem>
				<MenuItem>
					<LogoutButton />{!collapsed && "Logout"}
				</MenuItem>
			</MenuList>

		</AsideContainer>
	);
}
