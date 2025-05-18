'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type Role = 'MASTER' | 'PLAYER'

type CampaignUser = {
	id: string
	campaignId: string
	userId: number
	role: Role
	user: {
		name: string
	}
	campaign: {
		name: string
		currencyName: string
		description: string
	}
}

type SessionContextType = {
	campaignUser: CampaignUser | null
	setCampaignUser: (data: CampaignUser) => void
	isLoading: boolean
}

const defaultSession: SessionContextType = {
	campaignUser: null,
	setCampaignUser: () => { },
	isLoading: true,
}

const SessionContext = createContext<SessionContextType>(defaultSession)

export function SessionProvider({ children }: { children: ReactNode }) {
	const [campaignUser, setCampaignUser] = useState<CampaignUser | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		async function restoreSession() {
			try {
				const meRes = await fetch('/api/me')
				if (!meRes.ok) return

				const userData = await meRes.json()
				const campaignUserId = await userData?.campaignUserId
				if (!campaignUserId) return

				const campaignRes = await fetch(`/api/campaign-user/by-id/${campaignUserId}`)
				if (!campaignRes.ok) return

				const campaignUserData = await campaignRes.json()
				setCampaignUser(campaignUserData)
			} catch (error) {
				console.error('Erro ao restaurar sessão:', error)
			} finally {
				setIsLoading(false)
			}
		}

		restoreSession()
	}, [])

	return (
		<SessionContext.Provider value={{ campaignUser, setCampaignUser, isLoading }}>
			{children}
		</SessionContext.Provider>
	)
}

export function useSession() {
	const context = useContext(SessionContext)
	if (!context) {
		throw new Error('useSession deve ser usado dentro de um SessionProvider')
	}
	return context
}
