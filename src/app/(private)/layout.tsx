'use client'

import { SessionProvider } from "../contexts/SessionContext"
import { usePathname } from 'next/navigation'
import Aside from "../components/Aside"
import styled from "styled-components"
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({
    subsets: ['latin'],
    weight: ['600'], // ['400', '600', '700']
});

const GlobalLayoutMain = styled.main`
    display: flex;
    font-family: 'Cinzel', serif;
    min-height: 100vh;
`

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const hideAside = pathname === '/'

    return (
         <SessionProvider>
            <GlobalLayoutMain >
                {!hideAside && <Aside />}
                <main style={{flex: "1 1 0%"}}>
                    {children}
                </main>
            </GlobalLayoutMain>
        </SessionProvider>
    )
}
