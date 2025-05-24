'use client'

import { useSession } from '../contexts/SessionContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styled, { keyframes } from 'styled-components'
import { User } from '@prisma/client'
import Logout from '../components/LogoutButton'
import { LogOut } from 'lucide-react'
import DiceTwentyFaces from '../components/DiceTwentyFaces'

// === Styled Components ===
const LogoutWrapper = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
`

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  min-height: 100vh;
  min-width: 320px; 
  padding: 2rem;
  font-family: sans-serif;
  color: #f0f0f0;
  background-color:rgb(26, 26, 26);
`

const ContainerTitle = styled.div`
  display:flex;
  align-items: flex-end;
  padding: 1rem;
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const SpinningDice = styled(DiceTwentyFaces)`
  font-size: 3rem;
  color:rgb(168, 103, 212);
  animation: ${spin} 4s linear infinite;
  margin-bottom: 1.5rem;
  margin-right: 1rem;
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

const Button = styled.button<{ disabled?: boolean }>`
  background-color: #333;
  color: #f0f0f0;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  min-width: 200px;
  max-width: 100%;
  width: 100%;
  transition: background 0.3s;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#333' : '#555')};
  }

  @media (max-width: 480px) {
    min-width: unset;
    font-size: 0.9rem;
    padding: 0.6rem 1rem;
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

// === Tipagens ===
type Role = 'MASTER' | 'PLAYER'

type CampaignUser = {
	id: string
	campaignId: string
	userId: number
	role: Role
	user: { name: string }
	campaign: { name: string; currencyName: string, description: string }
}

type CreateCampaign = {
	name: string
	currencyName: string
	description: string
	userId: number | null
}

// === Componente Principal ===
export default function CampaignEntry() {
	const { setCampaignUser } = useSession()
	const [loadingCreate, setLoadingCreate] = useState(false)
	const [loadingJoinId, setLoadingJoinId] = useState<string | null>(null)
	const [errorMessage, setErrorMessage] = useState('')
	const router = useRouter()

	const [view, setView] = useState<'initial' | 'create' | 'join'>('initial')
	const [campaignList, setCampaignList] = useState<CampaignUser[]>([])
	const [createCampaign, setCreateCampaign] = useState<CreateCampaign>({
		name: '',
		currencyName: '',
		description: '',
		userId: null,
	})
	const [userData, setUserData] = useState<User | null>(null)

	// === Carrega o usuário ===
	useEffect(() => {
		async function loadUser() {
			const res = await fetch('/api/me')
			if (res.ok) {
				const data = await res.json()
				setUserData(data)
				setCreateCampaign(prev => ({ ...prev, userId: Number(data.id) }))
			}
		}
		loadUser()
	}, [])

	// === Lista campanhas para o usuário se juntar ===
	useEffect(() => {
		if (!userData || view !== 'join') return

		fetch(`/api/campaign-user/by-user/${userData.id}`)
			.then(res => res.json())
			.then(setCampaignList)
	}, [view, userData])

	// === Criação da campanha ===
	const handleCreate = async () => {
		if (!createCampaign.name || !createCampaign.description || !createCampaign.userId) {
			setErrorMessage('Preencha todos os campos obrigatórios.')
			return
		}

		setLoadingCreate(true)
		setErrorMessage('')

		try {
			const res = await fetch('/api/campaigns', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(createCampaign),
			})

			if (!res.ok) throw new Error()

			const campaign = await res.json()
			const resUser = await fetch('/api/campaign-user', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: createCampaign.userId,
					campaignId: campaign.id,
					role: 'MASTER',
				}),
			})

			if (resUser.ok) {
				const campaignUser = await resUser.json()
				const fullData = await fetch(`/api/campaign-user/by-id/${campaignUser.id}`).then(r => r.json())

				setCampaignUser(fullData)
			}
		} catch {
			setErrorMessage('Erro ao criar campanha.')
		} finally {
			setLoadingCreate(false)
			router.push('/home')
		}
	}

	// === Entrar em uma campanha existente ===
	const handleJoin = async (campaignUserId: string) => {
		setLoadingJoinId(campaignUserId)
		setErrorMessage('')

		try {
			const selected = campaignList.find(c => c.id === campaignUserId)
			if (!selected) throw new Error()

			setCampaignUser(selected)
			handleRefreshToken(selected.id)
		} catch {
			setErrorMessage('Erro ao entrar na campanha.')
		} finally {
			setLoadingJoinId(null)
		}
	}
	// === Atualiza o token e redireciona ===
	const handleRefreshToken = async (campaignUserId: string) => {
		await fetch('/api/token/refresh', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ campaignUserId }),
		})

		router.push('/home')
	}

	// === Render ===
	return (
		<Container>
			<LogoutWrapper>
				<Logout>
					<LogOut /> Logout
				</Logout>
			</LogoutWrapper>

			<ContainerTitle>
				<Title>Bem-vindo ao Gerenciador de Campanhas luan gay</Title>
			</ContainerTitle>

			{view === 'initial' && (
				<ButtonGroup>
					<Button onClick={() => setView('create')}>Criar Campanha</Button>
					<Button onClick={() => setView('join')}>Entrar em Campanha</Button>
				</ButtonGroup>
			)}

			{view === 'create' && (
				<Card>
					<SubTitle>Criar Nova Campanha</SubTitle>
					{errorMessage && <p style={{ color: 'red', marginBottom: '1rem' }}>{errorMessage}</p>}
					<Input
						//validar nome da
						placeholder="Nome da campanha"
						value={createCampaign.name}
						onChange={e => setCreateCampaign({ ...createCampaign, name: e.target.value })}
					/>
					<Input
						//validar nome da moeda
						placeholder="Nome da moeda da campanha"
						value={createCampaign.currencyName}
						onChange={e => setCreateCampaign({ ...createCampaign, currencyName: e.target.value })}
					/>
					<TextArea
						placeholder="Descrição"
						value={createCampaign.description}
						onChange={e => setCreateCampaign({ ...createCampaign, description: e.target.value })}
					/>
					<ButtonGroup>
						<Button onClick={handleCreate} disabled={loadingCreate}>
							{loadingCreate ? 'Salvando...' : 'Salvar'}
						</Button>
						<Button onClick={() => setView('initial')}>Voltar</Button>
					</ButtonGroup>
				</Card>
			)}

			{view === 'join' && (
				<Card>
					<SubTitle>Escolha uma campanha existente</SubTitle>
					{campaignList.map(campaignSelected => (
						<CampaignBox key={campaignSelected.id}>
							<strong>Criado por: {campaignSelected.user.name}</strong>
							<strong>{campaignSelected.campaign.name}</strong>
							<p>{campaignSelected.campaign.description}</p>
							<Button onClick={() => handleJoin(campaignSelected.id)} disabled={loadingJoinId === campaignSelected.id}>
								{loadingJoinId === campaignSelected.id ? 'Entrando...' : 'Entrar'}
							</Button>
						</CampaignBox>
					))}
					<Button style={{ marginTop: '1rem' }} onClick={() => setView('initial')}>Voltar</Button>
				</Card>
			)}
		</Container>
	)
}
