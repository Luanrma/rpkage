import { RefObject } from "react";

export default function (asideRef: RefObject<HTMLDivElement | null>, e: React.MouseEvent | React.TouchEvent) {
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
    }

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
}