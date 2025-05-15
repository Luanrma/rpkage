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
		description: string
	}
}

type CampaignCurrency = {
	id: string
	name: string
}

type SessionContextType = {
	campaignUser: CampaignUser | null
	setCampaignUser: (data: CampaignUser) => void
	campaignCurrency: CampaignCurrency | null
	setCampaignCurrency: (data: CampaignCurrency) => void
}

const defaultSession: SessionContextType = {
	campaignUser: null,
	setCampaignUser: () => {},
	campaignCurrency: null,
	setCampaignCurrency: () => {},
}

const SessionContext = createContext<SessionContextType>(defaultSession)

export function SessionProvider({ children }: { children: ReactNode }) {
	const [campaignUser, setCampaignUser] = useState<CampaignUser | null>(null)
	const [campaignCurrency, setCampaignCurrency] = useState<CampaignCurrency | null>(null)

	useEffect(() => {
		async function restoreSession() {
			try {
				const meRes = await fetch('/api/me') // ou /api/token/me
				if (!meRes.ok) return

				const userData = await meRes.json()
				const campaignUserId = await userData?.campaignUserId

				if (!campaignUserId) return

				const campaignRes = await fetch(`/api/campaign-user/by-id/${campaignUserId}`)
				if (!campaignRes.ok) return

				const campaignUserData = await campaignRes.json()
				setCampaignUser(campaignUserData)

				// Restoring campaignCurrency
				const currencyRes = await fetch(`/api/items/by-campaign-and-type/${campaignUserData.campaignId}/currency`)
				if (!currencyRes.ok) return

				const campaignCurrencyData = await currencyRes.json()
				setCampaignCurrency(campaignCurrencyData)
			} catch (error) {
				console.error('Erro ao restaurar sessão:', error)
			}
		}

		restoreSession()
	}, [])

	return (
		<SessionContext.Provider value={{ campaignUser, setCampaignUser, campaignCurrency, setCampaignCurrency }}>
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
