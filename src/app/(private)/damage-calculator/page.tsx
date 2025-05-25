'use client'

import { Activity } from 'lucide-react';
import { SpinningDice } from '@/app/components/SpinningDice'
import { useSession } from '@/app/contexts/SessionContext'
import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import { Cinzel } from 'next/font/google';
import { LoadingScreen } from '@/app/components/LoadingScreen';

const cinzel = Cinzel({
	subsets: ['latin'],
	weight: ['600'], // ou ['400', '600', '700'] se quiser mais opções
});

const Container = styled.div`
  display: flex;
  padding: 2rem;
  background: #111;
  color: white;
  align-items: center; 
  justify-content: center;
  flex-direction: column;
  flex-wrap: nowrap;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const PlayerRollContainer = styled.div`
  background: linear-gradient(145deg, #1a1a1a, #2c2c2c);
  border: 2px solid #4a2f14;
  border-radius: 16px;
  padding: 1.25rem 2rem;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;
  max-width: 460px;
  font-size: 1.15rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  color: #e6e6e6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7), inset 0 0 10px rgba(74, 47, 20, 0.3);
  user-select: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  font-family: 'Cinzel', serif;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.9), inset 0 0 12px rgba(74, 47, 20, 0.4);
  }

   @media (max-width: 480px) {
    padding: 1rem;
    max-width: 90%;
    flex-direction: column;
    align-items: flex-start;
    font-size: 1rem;
    gap: 0.5rem;
  }

  span {
    font-weight: 400;
    color: #c0a98e;
    font-family: 'Cormorant Garamond', serif;
  }

  strong {
    color: #d4af37;
    font-size: 1.35rem;
    font-weight: 700;
    text-shadow: 1px 1px 2px #000;
  }
`;

const CharacterCard = styled.div.withConfig({
	shouldForwardProp: (prop) => prop !== 'isActive',
}) <{ isActive: boolean }>`
  background: linear-gradient(145deg, #1a1a1a, #2c2c2c);
  border: ${({ isActive }) => (isActive ? '2px solid #d4af37' : '2px solid #4a2f14')};
  border-radius: 16px;
  padding: 1rem 1rem .5rem 1rem;
  margin: 1rem 0.5rem;
  width: 240px;
  font-size: 1.15rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  color: #e6e6e6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7),
              inset 0 0 10px ${({ isActive }) => (isActive ? '#d4af37' : 'rgba(74, 47, 20, 0.3)')};
  user-select: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
  font-family: 'Cinzel', serif;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.9),
                inset 0 0 12px ${({ isActive }) => (isActive ? '#d4af37' : 'rgba(74, 47, 20, 0.4)')};
  }

  @media (max-width: 480px) {
    width: 90%;
    margin: 0.5rem 0;
  }

  span {
    font-weight: 400;
    color: #c0a98e;
    font-family: 'Cormorant Garamond', serif;
    text-align: center;
  }

  strong {
    color: #d4af37;
    font-size: 1.35rem;
    font-weight: 700;
    text-shadow: 1px 1px 2px #000;
    text-align: center;
  }
`;

const EditSection = styled.div`
  margin-top: 0.75rem;
  width: 100%;
  background: linear-gradient(145deg, #131313, #1f1f1f);
  border: 1px solid #4a2f14;
  border-radius: 12px;
  padding: 0.75rem;
  font-size: 0.8rem;
  color: #c0a98e;
  font-family: 'Cormorant Garamond', serif;
  box-shadow: inset 0 0 6px rgba(74, 47, 20, 0.2);

  p {
    margin-bottom: 0.25rem;
    font-weight: bold;
    color: #d4af37;
    text-shadow: 1px 1px 1px #000;
  }

  input {
    width: 100%;
    padding: 0.4rem 0.6rem;
    margin-bottom: 0.5rem;
    border-radius: 8px;
    background-color: #2a2a2a;
    border: 1px solid #3a3a3a;
    color: #fff;
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;

    &::placeholder {
      color: #888;
      font-style: italic;
    }

    &:focus {
      outline: none;
      border-color: #d4af37;
      box-shadow: 0 0 4px #d4af37;
    }
  }
`;

const HPBar = styled.div<{ hp: number }>`
  background: #444;
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
  align-self: stretch;
  
  .fill {
    background: ${({ hp }) => (hp > 0 ? '#0f0' : '#900')};
    height: 12px;
    width: ${({ hp }) => Math.max(0, Math.min(100, hp))}%;
    transition: width 0.3s;
  }
`

const BattleLog = styled.div`
  background: linear-gradient(145deg, #1a1a1a, #2c2c2c);
  border: 2px solid #4a2f14;
  border-radius: 16px;
  padding: 1rem;
  margin: 1rem 0 0 0;
  color: #e6e6e6;
  font-family: 'Cormorant Garamond', serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7),
              inset 0 0 10px rgba(74, 47, 20, 0.3);
  max-height: 300px;
  overflow-y: auto;

  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  h2 {
    font-family: 'Cinzel', serif;
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: #d4af37;
    text-shadow: 1px 1px 2px #000;
  }

  ul {
    list-style-type: disc;
    padding-left: 1rem;
  }

  li {
    margin-bottom: 0.4rem;
    font-size: 0.95rem;
    color: #c0a98e;
    text-shadow: 1px 1px 1px #000;
  }

  p {
    font-style: italic;
    color: #aaa;
  }
`;

const Controls = styled.div`
  background: linear-gradient(145deg, #1a1a1a, #2c2c2c);
  border: 2px solid #4a2f14;
  border-radius: 16px;
  padding: 1rem 2rem;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  color: #e6e6e6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7),
              inset 0 0 10px rgba(74, 47, 20, 0.3);
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  font-weight: 600;
  user-select: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;

  @media (max-width: 480px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }

  span {
    font-weight: 400;
    color: #c0a98e;
    font-family: 'Cormorant Garamond', serif;
	font-size: 2rem;

	@media (max-width: 480px) {
      font-size: 1.5rem;
	}

    strong {
      color: #d4af37;
      font-weight: 700;
      text-shadow: 1px 1px 2px #000;
      font-size: 2rem;
    }
  }
`;

const Button = styled.button`
  background: #4a2f14;
  color: #e6e6e6;
  padding: 0.5rem 1rem;
  border: 2px solid #d4af37;
  border-radius: 12px;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover:not(:disabled) {
    background: #d4af37;
    color: #1a1a1a;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

type Character = {
	id: string
	name: string
	maxHp: number
	hp: number
	isPlayer: boolean
	isAlive: boolean
	initiative: number
}

export default function BattleSystem() {
	const { campaignUser } = useSession()
	const [characters, setCharacters] = useState<Character[]>([])
	const [currentTurnIndex, setCurrentTurnIndex] = useState(0)
	const [isFetchingPlayers, setIsFetchingPlayers] = useState(true)
	const [players, setPlayers] = useState<any[]>([])
	const [hasStarted, setHasStarted] = useState(false)
	const [turnCounter, setTurnCounter] = useState(1)
	const [battleLog, setBattleLog] = useState<string[]>([])
	const [hpInputs, setHpInputs] = useState<Record<string, string>>({})
	const [monsterName, setMonsterName] = useState('')
	const [monsterHP, setMonsterHP] = useState(20)

	const updatingRef = useRef(false)

	useEffect(() => {
		setIsFetchingPlayers(true)
		if (!campaignUser) {
			return
		}
		try {
			fetchPlayers()
		} catch (error) {
			console.error('Erro ao buscar jogadores:', error)
		}
		
	}, [campaignUser])

	const fetchPlayers = async () => {
		const response = await fetch(`/api/characters/by-campaign/${campaignUser!.campaignId}`)
		const responseData = await response.json()
		if (!response.ok) {
			return
		}
		setPlayers(responseData)
		setIsFetchingPlayers(false)
	}

	const handleDiceRoll = (value: number) => {
		if (hasStarted || isFetchingPlayers) {
			return
		}

		if (players.length > 0) {
			const nextPlayer = players[0]
			setPlayers(prev => prev.slice(1))

			const newChar: Character = {
				id: uuidv4(),
				name: nextPlayer.name,
				hp: nextPlayer?.sheet?.life ? Number(nextPlayer.sheet.life) : 0,
				maxHp: nextPlayer?.sheet?.life ? Number(nextPlayer.sheet.life) : 0,
				isPlayer: true,
				isAlive: true,
				initiative: value,
			}

			setCharacters(prev => [...prev, newChar])
		} else {
			const newMonster: Character = {
				id: uuidv4(),
				name: monsterName.trim() !== '' ? monsterName : `Monstro Selvagem ${Math.floor(Math.random() * 1000)}`,
				maxHp: monsterHP > 0 ? monsterHP : 20,
				hp: monsterHP > 0 ? monsterHP : 20,
				isPlayer: false,
				isAlive: true,
				initiative: value,
			}

			setCharacters(prev => [...prev, newMonster])
			setCurrentTurnIndex(0)
		}
	}

	const updateHP = (id: string, value: string) => {
		if (updatingRef.current) return
		updatingRef.current = true

		setCharacters(prev =>
			prev.map(char => {
				console.info(char)
				if (char.id !== id) return char

				let oldHp = char.hp
				let newHp = char.hp
				const parsed = parseInt(value)

				if (isNaN(parsed)) return char

				if (value.startsWith('+') || value.startsWith('-')) {
					newHp += parsed
				} else {
					newHp = parsed
				}

				const change = newHp - oldHp

				if (change !== 0) {
					const logEntry = `${char.name} ${change > 0 ? `se curou em ${change}` : `sofreu ${Math.abs(change)} de dano`}`
					setBattleLog(prev => [logEntry, ...prev])
				}

				return {
					...char,
					hp: newHp,
					isAlive: newHp > 0,
				}
			})
		)

		setTimeout(() => {
			updatingRef.current = false
		}, 50)
	}

	const removeCharacter = (id: string) => {
		if (confirm("Deseja realmente remover o personagem ?")) {
			setCharacters(prev => prev.filter(char => char.id !== id))
			setCurrentTurnIndex(0)
		}
	}

	const editCharacter = (id: string, field: keyof Character, value: string) => {
		setCharacters(prev =>
			prev.map(char => {
				if (char.id !== id) return char

				if (field === 'maxHp') {
					const newMaxHp = parseInt(value)
					return {
						...char,
						maxHp: newMaxHp,
						hp: newMaxHp,
						isAlive: newMaxHp > 0,
					}
				}

				return {
					...char,
					[field]: field === 'hp' || field === 'initiative' ? parseInt(value) : value,
				}
			})
		)
	}

	const nextTurn = () => {
		if (!hasStarted) {
			setHasStarted(true)
			return
		}

		const sorted = [...characters].sort((a, b) => b.initiative - a.initiative)
		const total = sorted.length
		if (total === 0) return

		let nextIndex = currentTurnIndex
		for (let i = 0; i < total; i++) {
			nextIndex = (nextIndex + 1) % total
			if (sorted[nextIndex].isAlive) {
				setCurrentTurnIndex(nextIndex)
				if (nextIndex === 0) {
					setTurnCounter(prev => prev + 1)
				}
				return
			}
		}
	}

	const handleHpInputChange = (id: string, value: string) => {
		setHpInputs(prev => ({ ...prev, [id]: value }))
	}

	const applyHpChange = (id: string) => {
		const value = hpInputs[id]
		if (value) {
			updateHP(id, value)
			setHpInputs(prev => ({ ...prev, [id]: '' }))
		}
	}

	const resetBattle = () => {
		setCharacters([])
		setPlayers([])
		setHasStarted(false)
		setTurnCounter(1)
		setBattleLog([])
		setCurrentTurnIndex(0)
		setHpInputs({})

		setIsFetchingPlayers(true)
		if (campaignUser) {
			fetchPlayers()
		}
	}

	const sortedCharacters = [...characters].sort((a, b) => b.initiative - a.initiative)

	if (isFetchingPlayers) {
		return <LoadingScreen />
	}
	
	return (
		<>
			<Container className={`${cinzel.className}`}>
				<SpinningDice 
					sides={20}
					onRoll={handleDiceRoll}
				/>
				{players.length > 0 ? (
					<PlayerRollContainer>
						<span>Iniciativa:</span>
						<strong>{players[0].name}</strong>
					</PlayerRollContainer>
				) : (
					<PlayerRollContainer>
						<span>Iniciativa:</span>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
							<input
								type="text"
								placeholder="Nome do monstro"
								value={monsterName}
								onChange={e => setMonsterName(e.target.value)}
								style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #999', background: '#222', color: 'white' }}
							/>
							<input
								type="number"
								placeholder="HP do monstro"
								value={monsterHP}
								onChange={e => setMonsterHP(Number(e.target.value))}
								style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #999', background: '#222', color: 'white' }}
							/>
						</div>
					</PlayerRollContainer>
				)}
			</Container>


			<div className="flex flex-wrap gap-4">
				{sortedCharacters.map((char, index) => (
					<CharacterCard key={char.id} isActive={index === currentTurnIndex && char.isAlive}>
						<button
							onClick={() => removeCharacter(char.id)}
							className="absolute top-2 left-2 text-red-500 text-[10px] font-semibold px-1 py-[2px] rounded hover:bg-red-700 hover:text-white transition"
						>
							✕
						</button>
						<strong>{char.name}</strong> <br />
						<small>{char.isPlayer ? 'Jogador' : 'Monstro'}</small>
						<HPBar hp={(char.hp / char.maxHp) * 100}>
							<div className="fill" />
						</HPBar>
						<p>HP: {char.hp} / {char.maxHp}</p>
						<p>Iniciativa: {char.initiative}</p>
						<div className="flex gap-2 mt-1">
							<input
								type="text"
								value={hpInputs[char.id] || ''}
								onChange={e => handleHpInputChange(char.id, e.target.value)}
								className="w-full px-1 py-1 rounded bg-zinc-700 text-white text-sm"
								placeholder="+10 / -10 / 30"
							/>
							<button
								onClick={() => applyHpChange(char.id)}
								className="bg-green-600 px-2 rounded text-white"
								title="Aplicar mudança de HP"
							>
								<Activity />
							</button>
						</div>
						<EditSection>
							<p>Editar:</p>
							<input
								type="text"
								placeholder="Nome"
								onBlur={e => editCharacter(char.id, 'name', e.target.value)}
							/>
							<input
								type="number"
								placeholder="HP máximo"
								onBlur={e => editCharacter(char.id, 'maxHp', e.target.value)}
							/>
						</EditSection>
					</CharacterCard>
				))}
			</div>

			<Controls>
				<Button onClick={nextTurn} disabled={characters.length === 0}>
					{!hasStarted ? 'Iniciar Batalha' : 'Próximo Personagem'}
				</Button>
				<Button onClick={resetBattle} disabled={!hasStarted}>
					Finalizar Batalha
				</Button>
				<span>
					Turno: <strong>{turnCounter}</strong>
				</span>
			</Controls>

			<BattleLog>
				<h2>Log da Batalha</h2>
				{battleLog.length === 0 ? (
					<p>Nenhum evento ainda</p>
				) : (
					<ul>
						{battleLog.map((log, i) => (
							<li key={i}>{log}</li>
						))}
					</ul>
				)}
			</BattleLog>
		</>
	)
}
