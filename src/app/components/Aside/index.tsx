'use client'

import Link from 'next/link';
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Activity, Swords, SquareArrowOutDownLeft, SquareArrowOutUpRight, Backpack, User, House, LogOut, Handshake } from "lucide-react";
import LogoutButton from '../LogoutButton';
import { useSession } from '@/app/contexts/SessionContext';

const AsideContainer = styled.div<{ $collapsed: boolean }>`
  position: block;
  top: 0.4rem;
  left: 0.4rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: rgb(49, 49, 49);
  padding: 1rem;
  width: ${({ $collapsed }) => ($collapsed ? "3.5rem" : "15rem")};
  height: auto;
  border-radius: 10px;
  transition: width 0.3s ease;
  color: white;
  z-index: 9999;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
`;

const MenuItem = styled.li`
  padding: 1rem 0;
  color: rgb(117, 117, 117);
  transition: transform 0.2s ease;

  &:hover {
    color: rgb(255, 255, 255);
    transform: translateX(0.2rem);
  }

  a {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: inherit;
    text-decoration: none;
  }
`;

const ToggleButton = styled.button<{ $collapsed: boolean }>`
  align-self: ${({ $collapsed }) => ($collapsed ? "center" : "flex-end")};
  margin-bottom: 1rem;
  transition: transform .5s ease;

  &:hover {
    transform: scale(1.3);
  }
`;

export default function Aside() {
	const [collapsed, setCollapsed] = useState(true);
	const { campaignUser } = useSession();

	const isMaster = campaignUser?.role === 'MASTER';
	const isPlayer = campaignUser?.role === 'PLAYER';

	return (
		<AsideContainer $collapsed={collapsed}>
			<ToggleButton onClick={() => setCollapsed(!collapsed)} $collapsed={collapsed}>
				{collapsed ? <SquareArrowOutUpRight /> : <SquareArrowOutDownLeft />}
			</ToggleButton>

			<MenuList>
				<MenuItem>
					<Link href="/home"><House />{!collapsed && "Home"}</Link>
				</MenuItem>
				{isMaster && (
					<MenuItem>
						<Link href="/user"><User />{!collapsed && "User"}</Link>
					</MenuItem>
				)}
				<MenuItem>
					<Link href="/"><Handshake />{!collapsed && "Campaing"}</Link>
				</MenuItem>
				{isMaster && (
					<MenuItem>
						<Link href="/item-generator"><Swords />{!collapsed && "Item Generator"}</Link>
					</MenuItem>
				)}
				<MenuItem>
					<Link href="/damage-calculator"><Activity />{!collapsed && "Damage Calculator"}</Link>
				</MenuItem>
				<MenuItem>
					<Link href="/inventory"><Backpack />{!collapsed && "Inventory"}</Link>
				</MenuItem>
				<MenuItem>
					<LogoutButton><LogOut />{!collapsed && "Logout"}</LogoutButton>
				</MenuItem>
			</MenuList>
		</AsideContainer>
	);
}
