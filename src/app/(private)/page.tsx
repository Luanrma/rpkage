'use client'

import { useSession } from '../contexts/SessionContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { User } from '@prisma/client'
import Logout from '../components/LogoutButton'
import { LogOut } from 'lucide-react'
import useRequest from '../hooks/use-request'

// === Styled Components ===
const LogoutWrapper = styled.div`
  position: fixed;
  top: 2rem;
  left: 2rem;
`

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  min-height: 100vh;
  min-width: 320px;
  margin: 0 auto;
  color: #f0f0f0;
  background-color: rgb(26, 26, 26);
  padding-top: 6rem;
`

const ContainerTitle = styled.div`
  display:flex;
  align-items: flex-end;
  padding: 1rem;
`

const Title = styled.h1`
  font-size: 1.5rem;
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
  width: 100%;
  max-width: 520px;
  margin: 1rem auto;
  padding: 1.25rem;
  border: 1px solid #333;
  border-radius: 12px;
  background-color: #1e1e1e;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const CampaignTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: #fff;
  margin: 0;
`

const CampaignCreator = styled.span`
  font-size: 0.9rem;
  color: #aaa;
`

const CampaignDescription = styled.p`
  background-color: rgba(255, 255, 255, 0.03);
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #d0d0d0;
  line-height: 1.6;
  box-shadow: inset 0 0 0 1px #333;
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
	const { doRequest } = useRequest();



	// === Carrega o usuário ===
	useEffect(() => {
		async function loadUser() {
			const res = await doRequest({
				url: '/api/me',
				method: 'get'
			})
			setUserData(res)

		}
		loadUser()
	}, [])

	useEffect(() => {
		if (userData) {
			setCreateCampaign(prev => ({ ...prev, userId: Number(userData.id) }));
		}
	}, [userData]);

	// === Lista campanhas para o usuário se juntar ===
	useEffect(() => {
		if (!userData || view !== 'join') return

		async function fetchCampaigns() {
			const res = await doRequest({
				url: `/api/campaign-user/by-user/${userData!.id}`,
				method: 'get',
			})
			setCampaignList(res)

		}

		fetchCampaigns()
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
			const campaign = await doRequest({
				url: '/api/campaigns',
				body: createCampaign,
				method: 'post'
			})
			if (!campaign) throw new Error()

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
				router.push('/home')
			}
		} catch {
			setErrorMessage('Erro ao criar campanha.')
		} finally {
			setLoadingCreate(false)
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
			<ContainerTitle>
				<LogoutWrapper>
					<Logout><LogOut /> Logout</Logout>
				</LogoutWrapper>
				<Title>Bem-vindo ao Gerenciador de Campanhas</Title>
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

					{campaignList.length > 0 ? (
						campaignList.map(({ id, user, campaign }) => (
							<CampaignBox key={id}>
								<CampaignTitle>{campaign.name}</CampaignTitle>
								<CampaignCreator>Criado por: {user.name}</CampaignCreator>
								{campaign.description && (
									<CampaignDescription>{campaign.description}</CampaignDescription>
								)}

								<Button
									onClick={() => handleJoin(id)}
									disabled={loadingJoinId === id}
								>
									{loadingJoinId === id ? 'Entrando...' : 'Entrar'}
								</Button>
							</CampaignBox>
						))
					) : (
						<CampaignDescription>Nenhuma campanha disponível no momento.</CampaignDescription>
					)}

					<Button style={{ marginTop: '1rem' }} onClick={() => setView('initial')}>
						Voltar
					</Button>
				</Card>
			)}
		</Container>
	)
}