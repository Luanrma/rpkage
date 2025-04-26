import { useState, useRef } from "react";
import styled from "styled-components";
import { Activity, Swords, SquareArrowOutDownLeft, SquareArrowOutUpRight } from "lucide-react";

const AsideContainer = styled.div<{ $collapsed: boolean }>`
  position: absolute;
  top: 0.4rem;
  left: 0.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(49, 49, 49);
  padding: 1rem;
  width: ${({ $collapsed }) => ($collapsed ? "70px" : "250px")};
  height: auto;
  border-radius: 10px;
  transition: width 0.3s ease;
  color: white;
  z-index: 1000;
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
  padding: 1rem 0;
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

export default function Aside({ changeSection }: AsideProps) {
    const [collapsed, setCollapsed] = useState(true)
    const asideRef = useRef<HTMLDivElement>(null)

    const handleMenuItemClick = (value: string) => changeSection(value)

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        
        const aside = asideRef.current;
        if (!aside) return;
      
        const isTouchEvent = 'touches' in e;
        const startX = isTouchEvent ? e.touches[0].clientX : e.clientX;
        const startY = isTouchEvent ? e.touches[0].clientY : e.clientY;
      
        const rect = aside.getBoundingClientRect();
        const shiftX = startX - rect.left;
        const shiftY = startY - rect.top;
      
        const onMove = (moveEvent: MouseEvent | TouchEvent) => {
          const moveX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
          const moveY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      
          let newLeft = moveX - shiftX;
          let newTop = moveY - shiftY;
      
          const asideWidth = aside.offsetWidth;
          const asideHeight = aside.offsetHeight;
      
          // Limites da tela
          if (newLeft < 0) newLeft = 0;
          if (newLeft + asideWidth > window.innerWidth) newLeft = window.innerWidth - asideWidth;
          if (newTop < 0) newTop = 0;
          if (newTop + asideHeight > window.innerHeight) newTop = window.innerHeight - asideHeight;
      
          aside.style.left = `${newLeft}px`;
          aside.style.top = `${newTop}px`;
        };
      
        const onEnd = () => {
          document.removeEventListener('mousemove', onMove as any);
          document.removeEventListener('mouseup', onEnd);
          document.removeEventListener('touchmove', onMove as any);
          document.removeEventListener('touchend', onEnd);
        };
      
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
      };

    return (
        <AsideContainer
            ref={asideRef}
            $collapsed={collapsed}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
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
            </MenuList>
        </AsideContainer>
    );
}
