'use client';

import { useState, useEffect } from 'react';
import { InterfaceItemGenerator } from '@/engine/ItemGenerators/Interfaces/ItemGenerator';
import styled from 'styled-components';
import { Send } from 'lucide-react';
import { useSession } from '@/app/contexts/SessionContext';
import { SaveItemPayload } from '@/app/services/itemService/itemService';

const Card = styled.div`
  position: relative;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  background: #1e1e1e;
  border: 1px solid rgb(97, 97, 97);
  border-radius: 12px;
  padding: 1.2rem;
  width: 25rem;
  text-align: left;
  box-shadow: 0 0 10px rgba(0,0,0,0.6);

  ul {
    padding-left: 1rem;
    margin: 0.5rem 0 0;
    list-style-type: disc;
  }

  ul li {
    margin-bottom: 0.4rem;
  }

  .rarity-common { color: #a0a0a0; }
  .rarity-uncommon { color: #ffffff; }
  .rarity-rare { color: #4a90e2; }
  .rarity-epic { color: #9b59b6; }
  .rarity-legendary { color: #e67e22; }

  .item-model {
    font-size: 14px;
    color: #b0b0b0;
    font-weight: 500;
    margin-top: -8px;
    margin-bottom: 8px;
    letter-spacing: 0.5px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 1rem;
  }
`;

const SaveIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #ccc;
  cursor: pointer;
  &:hover {
    color: #fff;
  }
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 2.5rem;
  right: .5rem;
  background: #2a2a2a;
  border: 1px solid rgb(111, 61, 190);
  border-radius: 5px;
  padding: 0.5rem;
  z-index: 10;
  width: 15rem;
`;

const DropdownItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  color: #eee;
  border-radius: 5px;
  border: 1px dashed rgb(111, 61, 190);
  list-style: none;

  &:hover {
    border: 1px solid rgb(111, 61, 190);
    background: rgb(62, 32, 109);
  }

  .char-role-MASTER {
    font-size: .8rem;
    padding: 0.2rem;
    background: rgb(111, 61, 190);
    border-radius: 5px;
    color: rgb(247, 247, 247);
  }

  .char-role-PLAYER {
    font-size: .8rem;
    padding: 0.2rem;
    background: rgb(33, 134, 2);
    border-radius: 5px;
    color: rgb(247, 247, 247);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
`;

const ModalContent = styled.div`
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 10px;
  border: 1px solid #6f3dbe;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 300px;
  max-width: 90%;
  text-align: center;

  h3 {
    color: #fff;
    margin-bottom: 1rem;
  }

  button {
    padding: .2rem;
    border-radius: 20px;
    border: none;
    background: rgb(111, 61, 190);
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    width: 5rem;

    &:hover {
      background: rgb(89, 34, 177);
    }
  }

  .modal-content-send-items {
	display:flex;
	align-items: center;
    justify-content: space-between;
	gap: .5rem;
  }

  .modal-content-sell-items {
	display:flex;
	align-items: center;
    justify-content: flex-start;
  }

  .modal-content-sell-items button {
	margin-right: 1rem;
  }

  .modal-content-sell-items label {
  	font-weight: bold;
	margin-right: .5rem;
  }

  .input-item-value {
	text-align: center;
  	border-radius: 5px;
	width: 4rem;
	background-color:rgb(36, 35, 35);
	border: 1px dashed #444;
	color: #f1f1f1;
  }

  .cancel {
    background: transparent;
    color: #ccc;
    border: 1px solid #555;
    margin-top: 1rem;

    &:hover {
      background: #3a3a3a;
    }
  }
`;

type Character = {
	id: string;
	userId: number;
	inventoryId: number;
	name: string;
	role: string;
};

export default function ItemCard({ 
	id,
	name,
	type,
	rarity,
	slot,
	attributes,
	inventoryItemId,
	onTransactionComplete
}: InterfaceItemGenerator & { onTransactionComplete?: () => void }) {
	const { campaignUser } = useSession();
	const [showDropdown, setShowDropdown] = useState(false);
	const [otherCharacters, setOtherCharacters] = useState<Character[]>([]);
	const [currentCharacter, setCurrentCharacter] = useState<{ userId: number, inventoryId: number } | null>(null);
	const [showTransactionModal, setShowTransactionModal] = useState(false);
	const [selectedCharacter, setSelectedCharacter] = useState<{ userId: number, inventoryId: number } | null>(null);
	const [itemValue, setItemValue] = useState<string>("1");
	let count = 1;

	const fetchCharacters = async () => {
		if (!campaignUser?.campaignId) return;

		try {
			const res = await fetch(`/api/characters/by-campaign-and-not-user/${campaignUser.campaignId}/${campaignUser.userId}`);
			if (!res.ok) {
				throw new Error('Erro na requisição de personagens');
			}
			const data = await res.json();
			setOtherCharacters(data.othersPlayer);
			setCurrentCharacter({ userId: data.currentPlayer.userId, inventoryId: data.currentPlayer.inventoryId })
		} catch (err) {
			console.error('Erro ao buscar personagens:', err);
		}
	};

	const handleTransactionMoney = async (amount: number) => {
		if (amount <= 0) {
			return
		}

		try {
			const payload = { amount };

			const res = await fetch('/api/items/trade', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				throw new Error('Erro ao transferir brics')
			}

			alert('Brics enviado com sucesso!');
			onTransactionComplete?.();
		} catch (err) {
			console.error(err);
			alert('Erro ao enviar brics.');
		} finally {
			setShowDropdown(false);
			setShowTransactionModal(false);
			setSelectedCharacter(null);
		}
	}

	const handleTransactionConfirm = async (transactionType: "TRADE" | "SELL" | "GIFT" | "DROP") => {
		if (!selectedCharacter || !campaignUser) {
			return;
		}

		if (transactionType === "SELL" && !itemValue) {
			return;
		}

		try {
			const payload: SaveItemPayload = {
				itemId: id ?? null,
				inventoryItemId: inventoryItemId ?? null,
				characterId: selectedCharacter.userId,
				campaignId: Number(campaignUser.campaignId),
				toInventoryId: selectedCharacter.inventoryId,
				fromInventoryId: currentCharacter?.inventoryId,
				type,
				rarity,
				attributes,
				name,
				slot: slot ?? "In your pocket",
				transactionType,
				itemValue,
			};

			const res = await fetch('/api/items/trade', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				throw new Error('Erro ao salvar item')
			}

			alert('Item salvo com sucesso!');
			onTransactionComplete?.();
		} catch (err) {
			console.error(err);
			alert('Erro ao salvar item.');
		} finally {
			setShowDropdown(false);
			setShowTransactionModal(false);
			setSelectedCharacter(null);
		}
	};

	useEffect(() => {
		if (showDropdown && otherCharacters.length === 0) {
			fetchCharacters();
		}
	}, [showDropdown]);

	return (
		<Card>
			<SaveIcon onClick={() => setShowDropdown(!showDropdown)}>
				<Send />
			</SaveIcon>

			{showDropdown && (
				<Dropdown>
					{otherCharacters.map((char) => (
						<DropdownItem key={char.id} onClick={() => {
							setSelectedCharacter({ userId: char.userId, inventoryId: char.inventoryId });
							setShowTransactionModal(true);
						}}>
							{char.name} <span className={`char-role-${char.role}`}>{char.role}</span>
						</DropdownItem>
					))}
				</Dropdown>
			)}

			{showTransactionModal && (
				<ModalOverlay>
					{type === 'brics' ? (
						<ModalContent>
							<h3>Transferir Brics</h3>

							<label htmlFor="amount">Quantidade:</label>
							<input
								className="input-brics-amount"
								type="number"
								name="amount"
								min="1"
								max={1000} // Simulação de valor máximo
								value={itemValue}
								onChange={(e) => setItemValue(e.target.value)}
							/>
							<p style={{ color: parseInt(itemValue) > 1000 ? 'red' : 'inherit' }}>
								Máximo disponível: 1000
							</p>

							<button onClick={() => handleTransactionConfirm("TRADE")}>Confirmar</button>
							<button className="cancel" onClick={() => setShowTransactionModal(false)}>Cancelar</button>
						</ModalContent>
					) : (
						<ModalContent>
							<h3>Tipo de Transação</h3>
							<div className="modal-content-send-items">
							<button onClick={() => handleTransactionConfirm("TRADE")}>Troca</button>
							<button onClick={() => handleTransactionConfirm("GIFT")}>Doação</button>
							{campaignUser?.role === 'MASTER' && (
								<button onClick={() => handleTransactionConfirm("DROP")}>Drop</button>
							)}
							</div>
							<hr />
							<div className="modal-content-sell-items">
							<button onClick={() => handleTransactionConfirm("SELL")}>Venda</button>
							<label htmlFor="item">Valor:</label>
							<input 
								className='input-item-value'
								name="item-value"
								type="number"
								min="1"
								value={itemValue}
								onChange={(e) => setItemValue(e.target.value)}
							/>
							</div>
							<button className="cancel" onClick={() => setShowTransactionModal(false)}>Cancelar</button>
						</ModalContent>
					)}
				</ModalOverlay>
			)}

			<h3 className={`rarity-${rarity}`}>{`${type.toLocaleUpperCase()} (${rarity})`}</h3>
			<strong className="item-model">{slot}</strong>
			<hr />
			<ul>
				{attributes.map(opt => (
					<li key={count++}>{`${opt.description} ${opt.status} ${opt.diceBonus ?? ""}`}</li>
				))}
			</ul>
		</Card>
	);
}
