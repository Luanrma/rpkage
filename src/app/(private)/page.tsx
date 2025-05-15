'use client'

import { useSession } from '../contexts/SessionContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { User } from '@prisma/client'
import Logout from '../components/LogoutButton'
import { LogOut } from 'lucide-react'

// === Styled Components ===
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

// === Tipagens ===
type Role = 'MASTER' | 'PLAYER'

type CampaignUser = {
  id: string
  campaignId: string
  userId: number
  role: Role
  user: { name: string }
  campaign: { name: string; description: string }
}

type SelectedCampaign = {
  name: string
  description: string
  userId: number | null
}

// === Componente Principal ===
export default function CampaignEntry() {
  const { setCampaignUser, setCampaignCurrency } = useSession()
  const router = useRouter()

  const [view, setView] = useState<'initial' | 'create' | 'join' | 'currency'>('initial')
  const [campaignCreatedId, setCampaignCreatedId] = useState<string | null>(null)
  const [campaignList, setCampaignList] = useState<CampaignUser[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<SelectedCampaign>({
    name: '',
    description: '',
    userId: null,
  })
  const [campaignUserId, setCampaignUserId] = useState<string | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [currencyItem, setCurrencyItem] = useState({ name: '' })

  // === Carrega o usuário ===
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

  // === Lista campanhas para o usuário se juntar ===
  useEffect(() => {
    if (!userData || view !== 'join') return

    fetch(`/api/campaign-user/by-user/${userData.id}`)
      .then(res => res.json())
      .then(setCampaignList)
  }, [view, userData])

  // === Criação da campanha ===
  const handleCreate = async () => {
    if (!selectedCampaign.userId) return

    const res = await fetch(`/api/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedCampaign),
    })

    if (!res.ok) {
      console.error('Erro ao criar campanha')
      return
    }

    const campaign = await res.json()
    setCampaignCreatedId(campaign.id)

    const resUser = await fetch(`/api/campaign-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: selectedCampaign.userId,
        campaignId: campaign.id,
        role: 'MASTER',
      }),
    })

    if (resUser.ok) {
      const campaignUser = await resUser.json()
      const fullData = await fetch(`/api/campaign-user/by-id/${campaignUser.id}`).then(r => r.json())

      setCampaignUser(fullData)
      setCampaignUserId(campaignUser.id)
      setView('currency')
    }
  }

  // === Criação da moeda ===
  const handleCreateCurrencyItem = async () => {
    if (!campaignCreatedId || !campaignUserId) return

    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId: campaignCreatedId,
        type: 'currency',
        rarity: 'common',
        name: currencyItem.name,
        slot: 'pocket',
        attributes: {
          description: 'Moeda da campanha',
        },
      }),
    })

    if (res.ok) {
      const currency = await res.json()
      setCampaignCurrency({ id: currency.id, name: currency.name })
      handleRefreshToken(campaignUserId)
    }
  }

  // === Entrar em uma campanha existente ===
  const handleJoin = async (campaignUserId: string) => {
    const selected = campaignList.find(c => c.id === campaignUserId)
    if (!selected) return

    setCampaignUser(selected)

    try {
      const res = await fetch(`/api/items/by-campaign-and-type/${selected.campaignId}/currency`)
      if (!res.ok) {
        alert('Erro ao buscar moeda da campanha')
        return
      }

      const currency = await res.json()
      if (!currency.id) {
        alert('Moeda inválida')
        return
      }

      setCampaignCurrency({ id: currency.id, name: currency.name })
      handleRefreshToken(selected.id)
    } catch (e) {
      console.error(e)
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
      <Logout><LogOut /></Logout>

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

      {view === 'currency' && (
        <Card>
          <SubTitle>Defina a Moeda da Campanha</SubTitle>
          <Input
            placeholder="Nome da Moeda (ex: BRICS)"
            value={currencyItem.name}
            onChange={e => setCurrencyItem({ ...currencyItem, name: e.target.value })}
          />
          <ButtonGroup>
            <Button onClick={handleCreateCurrencyItem}>Salvar Moeda</Button>
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
              <Button onClick={() => handleJoin(campaignSelected.id)}>Entrar</Button>
            </CampaignBox>
          ))}
          <Button style={{ marginTop: '1rem' }} onClick={() => setView('initial')}>Voltar</Button>
        </Card>
      )}
    </Container>
  )
}
