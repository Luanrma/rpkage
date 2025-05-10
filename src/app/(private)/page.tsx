'use client'

import { useSession } from '../contexts/SessionContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { User } from '@prisma/client'

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
  color: #f0f0f0;
  background-color: #1a1a1a;
  min-height: 100vh;
  text-align: center;
`

const Title = styled.h1`
  margin-bottom: 2rem;
  color: #ffffff;
`

const SubTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: #ffffff;
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`

const Button = styled.button`
  background-color: #333;
  color: #f0f0f0;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  min-width: 200px;
  transition: background 0.3s;

  &:hover {
    background-color: #555;
  }
`

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background: #2a2a2a;
  color: #f0f0f0;
  border: 1px solid #444;
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  min-height: 80px;
  margin-bottom: 1rem;
  border-radius: 4px;
  background: #2a2a2a;
  color: #f0f0f0;
  border: 1px solid #444;
`

const Card = styled.div`
  background-color: #262626;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  text-align: left;
`

const CampaignBox = styled.div`
  background: #1f1f1f;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 1rem;
  margin: 0.5rem 0;
`

type Role = 'MASTER' | 'PLAYER'

type CampaignUser = {
	id: string,
	campaignId: string
	userId: number,
	role: Role,
	user: {
		name: string
	}
	campaign: {
		name: string,
		description: string,
	}
}

type SelectedCampaign = {
	name: string,
	description:string,
	userId: number | null 
}

export default function CampaignEntry() {
	const { setCampaignUser } = useSession()
	const router = useRouter()

	const [view, setView] = useState<'initial' | 'create' | 'join'>('initial')
	const [campaignList, setCampaignList] = useState<CampaignUser[]>([])
	const [selectedCampaign, setSelectedCampaign] = useState<SelectedCampaign>({ name: '', description: '', userId: null, })
	const [userData, setUserData] = useState<User | null>(null)

	useEffect(() => {
		async function loadUser() {
			const res = await fetch('/api/me')
			if (res.ok) {
				const data = await res.json()
				setUserData(data)
				setSelectedCampaign(prev => ({ ...prev, userId: Number(data.id) }))
			}
		}
		loadUser()
	}, [])

	useEffect(() => {
		if (!userData || view !== 'join') return

		fetch(`/api/campaign-user/by-user/${userData.id}`)
			.then(res => res.json())
			.then(setCampaignList)
	}, [view, userData])

	const handleCreate = async () => {
		if (!selectedCampaign.userId) {
			console.error('userId está vazio!')
			return
		}

		const newCampaignResponse = await fetch(`/api/campaigns`, {
			method: 'POST',
			body: JSON.stringify(selectedCampaign),
			headers: { 'Content-Type': 'application/json' },
		})

		if (newCampaignResponse.ok) {
			const campaignCreated = await newCampaignResponse.json()

			const newCampaignUserResponse = await fetch(`/api/campaign-user`, {
				method: 'POST',
				body: JSON.stringify({
					userId: selectedCampaign.userId,
					campaignId: campaignCreated.id,
					role: 'MASTER'
				}),
				headers: { 'Content-Type': 'application/json' },
			})

			if (newCampaignUserResponse.ok) {
				const newCampaignUserCreated = await newCampaignUserResponse.json()
				fetch(`/api/campaign-user/by-id/${newCampaignUserCreated.id}`)
					.then(res => res.json())
					.then(setCampaignUser)

				handleRefreshToken(newCampaignUserCreated.id)
				router.push('/home')
			}
		}
	}

	const handleJoin = async (campaignUserId: string) => {
		const selectedCampaignUser = campaignList.find(c => c.id === campaignUserId)
		if (!selectedCampaignUser) return

		setCampaignUser(selectedCampaignUser)
		handleRefreshToken(selectedCampaignUser.id)
		router.push('/home')
	}

	const handleRefreshToken = async (selectedCampaignUserId: string) => {
		await fetch('/api/token/refresh', {
			method: 'POST',
			body: JSON.stringify({ campaignUserId: selectedCampaignUserId }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}

	return (
		<Container>
			<Title>🎲 Bem-vindo ao Gerenciador de Campanhas</Title>

			{view === 'initial' && (
				<ButtonGroup>
					<Button onClick={() => setView('create')}>Criar Campanha</Button>
					<Button onClick={() => setView('join')}>Entrar em Campanha</Button>
				</ButtonGroup>
			)}

			{view === 'create' && (
				<Card>
					<SubTitle>Criar Nova Campanha</SubTitle>
					<Input
						placeholder="Nome da campanha"
						value={selectedCampaign.name}
						onChange={e => setSelectedCampaign({ ...selectedCampaign, name: e.target.value })}
					/>
					<TextArea
						placeholder="Descrição"
						value={selectedCampaign.description}
						onChange={e => setSelectedCampaign({ ...selectedCampaign, description: e.target.value })}
					/>
					<ButtonGroup>
						<Button onClick={handleCreate}>Salvar</Button>
						<Button onClick={() => setView('initial')}>Voltar</Button>
					</ButtonGroup>
				</Card>
			)}

			{view === 'join' && (
				<Card>
					<SubTitle>Escolha uma campanha existente</SubTitle>
					{campaignList.map(c => (
						<CampaignBox key={c.id}>
							<strong>Criado por: {c.user.name}</strong>
							<strong>{c.campaign.name}</strong>
							<p>{c.campaign.description}</p>
							<Button onClick={() => handleJoin(c.id)}>Entrar</Button>
						</CampaignBox>
					))}
					<Button style={{ marginTop: '1rem' }} onClick={() => setView('initial')}>Voltar</Button>
				</Card>
			)}
		</Container>
	)
}