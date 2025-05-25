'use client'

import { SpinningDice } from '@/app/components/SpinningDice'
import { useSession } from '@/app/contexts/SessionContext'
import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { Cinzel } from 'next/font/google';
import { Cormorant_Garamond } from 'next/font/google';

const cinzel = Cinzel({
	subsets: ['latin'],
	weight: ['600'], // ou ['400', '600', '700'] se quiser mais opções
});

const cormorant = Cormorant_Garamond({
	subsets: ['latin'],
	weight: ['400'],
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
  padding: 2rem;
  background: #111;
  color: white;
`

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
  background: ${({ isActive }) => (isActive ? '#333' : '#222')};
  border: ${({ isActive }) => (isActive ? '2px solid #0f0' : '1px solid #444')};
  border-radius: 8px;
  padding: 1rem;
  margin: 0.5rem;
  width: 220px;
`

const HPBar = styled.div<{ hp: number }>`
  background: #444;
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;

  .fill {
    background: ${({ hp }) => (hp > 0 ? '#0f0' : '#900')};
    height: 12px;
    width: ${({ hp }) => Math.max(0, Math.min(100, hp))}%;
    transition: width 0.3s;
  }
`

const BattleLog = styled.div`
  background: #1a1a1a;
  color: #ccc;
  padding: 1rem;
  margin-top: 2rem;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #333;
  border-radius: 8px;
`

const Controls = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
`

const Button = styled.button<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? '#555' : '#007acc')};
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#555' : '#005fa3')};
  }
`

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
	const [players, setPlayers] = useState<any[]>([])
	const [hasStarted, setHasStarted] = useState(false)
	const [turnCounter, setTurnCounter] = useState(1)
	const [battleLog, setBattleLog] = useState<string[]>([])
	const [hpInputs, setHpInputs] = useState<Record<string, string>>({})
	const [monsterName, setMonsterName] = useState('')
	const [monsterHP, setMonsterHP] = useState(20)

	const updatingRef = useRef(false)

	useEffect(() => {
		if (!campaignUser) return
		fetchPlayers()
	}, [campaignUser])

	const fetchPlayers = async () => {
		const response = await fetch(`/api/characters/by-campaign/${campaignUser!.campaignId}`)
		const responseData = await response.json()
		setPlayers(responseData)
	}

	const handleDiceRoll = (value: number) => {
		if (hasStarted) return

		if (players.length > 0) {
			const nextPlayer = players[0]
			setPlayers(prev => prev.slice(1))

			const newChar: Character = {
				id: uuidv4(),
				name: nextPlayer.name,
				hp: nextPlayer?.sheet?.life ? nextPlayer.sheet.life : 0,
				maxHp: nextPlayer?.sheet?.life ? nextPlayer.sheet.life : 0,
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
		setCharacters(prev => prev.filter(char => char.id !== id))
		setCurrentTurnIndex(0)
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
		// Refetch players after reset
		if (campaignUser) fetchPlayers()
	}

	const sortedCharacters = [...characters].sort((a, b) => b.initiative - a.initiative)

	return (
		<>
			<Container className={`${cinzel.className}`}>
				<SpinningDice sides={20} onRoll={handleDiceRoll} />
				{players.length > 0 ? (
					<PlayerRollContainer>
						<span>Rolando iniciativa para:</span>
						<strong>{players[0].name}</strong>
					</PlayerRollContainer>
				) : (
					<PlayerRollContainer>
						<span>Rolando iniciativa para monstros</span>
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

			<h1 className="text-2xl font-bold mb-4">Sistema de Batalha</h1>
			<div className="flex flex-wrap gap-4">
				{sortedCharacters.map((char, index) => (
					<CharacterCard key={char.id} isActive={index === currentTurnIndex && char.isAlive}>
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
								🎲
							</button>
						</div>
						<button
							onClick={() => removeCharacter(char.id)}
							className="mt-1 text-red-500 text-xs"
						>
							Remover
						</button>
						<div className="mt-2 text-xs text-gray-400">
							<p>Editar:</p>
							<input
								type="text"
								className="mb-1 w-full px-1 py-0.5 rounded bg-zinc-800 text-white"
								placeholder="Nome"
								onBlur={e => editCharacter(char.id, 'name', e.target.value)}
								defaultValue={char.name}
							/>
							<input
								type="number"
								className="mb-1 w-full px-1 py-0.5 rounded bg-zinc-800 text-white"
								placeholder="HP máximo"
								onBlur={e => editCharacter(char.id, 'maxHp', e.target.value)}
								defaultValue={char.maxHp}
							/>
						</div>
					</CharacterCard>
				))}
			</div>

			<Controls>
				<Button onClick={nextTurn} disabled={characters.length === 0}>
					{!hasStarted ? 'Iniciar Batalha' : 'Próximo Turno'}
				</Button>
				<Button onClick={resetBattle} disabled={!hasStarted}>
					Finalizar Batalha
				</Button>
				<span>
					Turno: <strong>{turnCounter}</strong>
				</span>
			</Controls>

			<BattleLog>
				<h2 className="text-lg font-semibold mb-2">Log da Batalha</h2>
				{battleLog.length === 0 ? (
					<p>Nenhum evento ainda</p>
				) : (
					<ul className="list-disc list-inside">
						{battleLog.map((log, i) => (
							<li key={i}>{log}</li>
						))}
					</ul>
				)}
			</BattleLog>
		</>
	)
}
