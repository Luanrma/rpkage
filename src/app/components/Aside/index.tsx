import { useState } from "react";
import styled from "styled-components";
import { Activity, Swords, SquareArrowOutDownLeft, SquareArrowOutUpRight } from "lucide-react";

const AsideContainer = styled.div<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(49, 49, 49);
  padding: 1rem;
  width: ${({ $collapsed }) => ($collapsed ? "70px" : "250px")};
  height: 10%;
  border-radius: 10px;
  transition: width 0.3s ease;
  color: white;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  cursor: pointer;
  color:rgb(117, 117, 117);

  &:hover {
    color:rgb(255, 255, 255);
    transform: translateX(5px);
  }

  svg {
    flex-shrink: 0;
  }
`;

const ToggleButton = styled.button<{ $collapsed: boolean }>`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
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

export default function ({ changeSection }: AsideProps) {
    const [collapsed, setCollapsed] = useState(false);

    const handleMenuItemClick = (value: string) => {
        changeSection(value);
    };

    return (
        <AsideContainer $collapsed={collapsed}>
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
            </MenuList>
        </AsideContainer>
    );
};
