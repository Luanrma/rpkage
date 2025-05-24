'use client'

import { SessionProvider } from "../contexts/SessionContext"
import { usePathname } from 'next/navigation'
import Aside from "../components/Aside"

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const hideAside = pathname === '/'

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <SessionProvider>
                    {!hideAside && <Aside />}
                    <main style={{ flex: 1, padding: "1rem", minWidth: 0 }}>
                        {children}
                    </main>
            </SessionProvider>
        </div>
    )
}
