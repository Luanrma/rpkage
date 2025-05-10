'use client'

import { useSession } from '@/app/contexts/SessionContext'
import { Character, Campaign } from '@prisma/client'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

type CharacterWithCampaign = Character & {
	campaign?: Campaign | null
}

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background-color: rgb(12, 12, 12);
`

const Content = styled.div`
  background: rgba(207, 206, 206, 0.1);
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: white;
`

const CharactersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 2rem;
`

const CharacterCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem;
  color: white;
  width: 200px;
  box-shadow: 0 0 15px 1px rgba(255, 255, 255, .6);
`

export default function HomePage() {
	const { campaignUser } = useSession()
	const [characters, setCharacters] = useState<CharacterWithCampaign[]>([])

	useEffect(() => {
		if (!campaignUser?.userId) return;

		async function loadCharacters() {
			const res = await fetch(`/api/characters/by-user/${campaignUser!.userId}`)
			if (res.ok) {
				const data = await res.json()
				setCharacters(data)
			}
		}

		loadCharacters()
	}, [campaignUser?.userId])
	console.log(campaignUser)
	if (!campaignUser) return <p>Carregando...</p>

	return (
		<Container>
			<Content>
				<strong>Campanha ID: {campaignUser.campaignId}</strong>
				<strong>Campanha User ID: {campaignUser.id}</strong>
				<strong>User ID: {campaignUser.userId}</strong>
				<h1>Campanha atual: {campaignUser.campaign.name}</h1>
				<p>{campaignUser.campaign.description}</p>
				<hr/>
				<p><strong>Você é:</strong> {campaignUser.role}</p>
			</Content>

			<CharactersContainer>
				{characters.map((char) => (
					<CharacterCard key={char.id.toString()}>
						<h2>{char.name}</h2>
						<p>ID: {char.id.toString()}</p>
						<p>Campanha: {char.campaign?.name || 'Nenhuma'}</p>
					</CharacterCard>
				))}
			</CharactersContainer>
		</Container>
	)
}
