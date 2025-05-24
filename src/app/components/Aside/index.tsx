'use client'

import Link from 'next/link';
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Activity, Swords, SquareArrowOutDownLeft, SquareArrowOutUpRight, Backpack, User, House, LogOut, Handshake, SmilePlus } from "lucide-react";
import LogoutButton from '../LogoutButton';
import { useSession } from '@/app/contexts/SessionContext';
import { usePathname } from 'next/navigation'

const AsideContainer = styled.div<{ $collapsed: boolean }>`
  position: block;
  top: 0.4rem;
  left: 0.4rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: rgb(49, 49, 49);
  padding: 1rem;
  width: ${({ $collapsed }) => ($collapsed ? "5rem" : "15rem")};
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

const MenuItem = styled.li <{ $active?: boolean }>
	`
  padding: 1rem 0;
  color: white ;
  transition: all 0.2s ease;
	backgroundColor: ${({ $active }) => ($active ? 'white' : 'transparent')}
	borderradius: 4x;

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
		padding: 0.5rem;
  }

	svg {
    color: ${({ $active }) => ($active ? '#6e3fae' : 'currentColor')};
  }
`;

const ToggleButton = styled.button<{ $collapsed: boolean }>`
  align-self: ${({ $collapsed }) => ($collapsed ? "center" : "flex-end")};
  margin-bottom: 1rem;
  transition: transform .5s ease;
	background: none;
  border: none;
  color: white;
  cursor: pointer;

  &:hover {
    transform: scale(1.3);
  }
`;

export default function Aside() {
	const [collapsed, setCollapsed] = useState(true);
	const { campaignUser } = useSession();
	const [activeItem, setActiveItem] = useState('/home')
	const pathname = usePathname(); // Get current route path
	const [isClient, setIsClient] = useState(false);




	// Após montar no client, ativa a renderização real
	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		// Retorna nulo no server e no primeiro render client, evitando mismatch
		return null;
	}

	const isMaster = campaignUser?.role === 'MASTER';
	const isPlayer = campaignUser?.role === 'PLAYER';

	const isActive = (path: String) => {
		return pathname === path;
	}
	return (
		<AsideContainer $collapsed={collapsed}>
			<ToggleButton onClick={() => setCollapsed(!collapsed)} $collapsed={collapsed}>
				{collapsed ? <SquareArrowOutUpRight /> : <SquareArrowOutDownLeft />}
			</ToggleButton>

			<MenuList>
				<MenuItem $active={isActive('/home')}>
					<Link href="/home"><House />{!collapsed && "Home"}</Link>
				</MenuItem>
				<MenuItem $active={isActive('/character')}>
					<Link href="/character"><SmilePlus />{!collapsed && "Character"}</Link>
				</MenuItem>
				{isMaster && (
					<MenuItem $active={isActive('/user')}>
						<Link href="/user"><User />{!collapsed && "User"}</Link>
					</MenuItem>
				)}
				<MenuItem $active={isActive('/item-generator')}>
					<Link href="/item-generator"><Swords />{!collapsed && "Item Generator"}</Link>
				</MenuItem>

				<MenuItem $active={isActive('/damage-calculator')}>
					<Link href="/damage-calculator"><Activity />{!collapsed && "Damage Calculator"}</Link>
				</MenuItem>
				<MenuItem $active={isActive('/inventory')}>
					<Link href="/inventory"><Backpack />{!collapsed && "Inventory"}</Link>
				</MenuItem>
				<MenuItem $active={isActive('/')}>
					<Link href="/"><Handshake />{!collapsed && "Campaing"}</Link>
				</MenuItem>
				<MenuItem >
					<LogoutButton><LogOut />{!collapsed && "Logout"}</LogoutButton>
				</MenuItem>
			</MenuList>
		</AsideContainer>
	);
}
