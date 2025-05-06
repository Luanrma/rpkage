'use client'

import Aside from "../components/Aside"

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Aside />
            <main style={{ flex: 1, padding: "1rem" }}>
                {children}
            </main>
        </div>
    )
}
