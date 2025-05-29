'use client'

import { SessionProvider } from "../contexts/SessionContext"
import { usePathname } from 'next/navigation'
import Aside from "../components/Aside"
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({
    subsets: ['latin'],
    weight: ['600'], // ['400', '600', '700']
});

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const hideAside = pathname === '/'

    return (
         <SessionProvider>
            <div style={{display: 'flex', minHeight: '100vh', fontFamily: "Cinzel, serif"}}>
                {!hideAside && <Aside />}
                <main style={{flex: "1 1 0%"}}>
                    {children}
                </main>
            </div>
        </SessionProvider>
    )
}
