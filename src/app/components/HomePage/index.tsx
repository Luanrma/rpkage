'use client'

import { useSession } from '@/app/contexts/SessionContext'
import { Character, Campaign } from '@prisma/client'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { GiWizardFace } from 'react-icons/gi'
import { LoadingScreen } from '../LoadingScreen'

type CharacterWithCampaign = Character & {
	campaign?: Campaign | null
}

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f0f0f, #1e1e1e);
  display: flex;
  justify-content: center;
  padding: 4rem 2rem;
  color: #f4f4f4;
  font-family: 'Cinzel', serif;
`

const InnerWrapper = styled.div`
  max-width: 1100px;
  width: 100%;
`

const Content = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  padding: 2.5rem 3rem;
  border-radius: 16px;
  box-shadow: 0 0 30px rgba(255, 221, 87, 0.1);
  text-align: center;
  margin-bottom: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.08);

  h1 {
    font-size: 2.5rem;
    margin: 1rem 0;
    color: #ffdd57;
  }

  p {
    color: #ccc;
    margin-bottom: 0.5rem;
  }

  strong {
    display: block;
    margin: 0.5rem 0;
    color: #aaa;
    font-weight: 400;
  }

  hr {
    margin: 1.5rem 0;
    border: none;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: left;
  flex-wrap: wrap;
`;

const CampaignInfo = styled.div`
  h1 {
    margin: 0;
    font-size: 2.2rem;
    color: #fff;
  }

  p {
    margin: 0;
    color: #bbb;
    font-size: 0.95rem;
  }
`;

const InfoGrid = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const InfoItem = styled.div`
  text-align: left;

  p {
    margin: 0;
    color: #999;
    font-size: 0.9rem;
  }

  strong {
    color: #fff;
    font-size: 1.1rem;
  }
`;

const StyledHr = styled.hr`
  margin: 1.5rem 0;
  border: none;
  border-top: 1px solid #333;
`;

const CharactersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
`

const CharacterCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 1.5rem;
  width: 220px;
  text-align: center;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 0 20px rgba(255, 221, 87, 0.5);
  }

  h2 {
    margin-bottom: 0.5rem;
    font-size: 1.4rem;
    color: #ffdd57;
  }

  p {
    font-size: 0.9rem;
    color: #ddd;
  }
`

export default function HomePage() {
	const [loading, setLoading] = useState(true);
	const { campaignUser } = useSession()
	const [characters, setCharacters] = useState<CharacterWithCampaign[]>([])

	useEffect(() => {
		if (!campaignUser) {
			return
		}

		async function loadCharacters() {
			try {
				const res = await fetch(`/api/characters/by-user/${campaignUser!.userId}`)
				if (res.ok) {
					const data = await res.json()
					setCharacters(data)
				}
			} catch {
				console.error('Erro ao buscar personagem existente');
			} finally {
				setLoading(false);
			}
		}

		loadCharacters()
	}, [!campaignUser])

	if (!campaignUser) {
		return <LoadingScreen />
	}

	return (
		<Container>
			<InnerWrapper>
				<Content
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<Header>
						<GiWizardFace size={52} color="#ffdd57" />
						<CampaignInfo>
							<h1>{campaignUser.campaign.name}</h1>
							<p>{campaignUser.campaign.description}</p>
						</CampaignInfo>
					</Header>

					<StyledHr />

					<InfoGrid>
						<InfoItem>
							<p>Função</p>
							<strong>{campaignUser.role}</strong>
						</InfoItem>
						<InfoItem>
							<p>ID do Usuário</p>
							<strong>{campaignUser.userId}</strong>
						</InfoItem>
						<InfoItem>
							<p>ID da Campanha</p>
							<strong>{campaignUser.campaignId}</strong>
						</InfoItem>
					</InfoGrid>
				</Content>

				<CharactersContainer>
					{characters.map((char, i) => (
						<CharacterCard
							key={char.id.toString()}
							initial={{ opacity: 0, scale: 0.2 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
						>
							<h2>{char.name}</h2>
							<p><strong>ID:</strong> {char.id.toString()}</p>
							<p><strong>Campanha:</strong> {char.campaign?.name || 'Nenhuma'}</p>
						</CharacterCard>
					))}
				</CharactersContainer>
			</InnerWrapper>
		</Container>
	)
}
