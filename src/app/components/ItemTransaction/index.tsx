
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SaveItemPayload, CurrencyTransactionPayload } from '@/app/services/itemService/itemService';
import { LoadingScreen } from '../LoadingScreen';

const Dropdown = styled.ul`
  position: absolute;
  top: 2.5rem;
  right: 0rem;
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
  background-color: rgba(0, 0, 0, 0.6);
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: .5rem;
  }

  .modal-content-sell-items {
    display: flex;
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
    background-color: rgb(36, 35, 35);
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

const ErrorMessage = styled.div`
  background-color: #512121;
  color: #ffb3b3;
  padding: 0.75rem;
  border: 1px solid #ff4d4d;
  border-radius: 5px;
  font-size: 0.9rem;
`;

type Character = {
	id: string;
	userId: number;
	inventoryId: number;
	walletId: number;
	name: string;
	role: string;
};

type TransactionModalProps = {
	campaignUser: any;
	selectedCharacter: Character;
	currentCharacter: Character;
	showDropdown: boolean;
	item: ItemDataProps;
	onTransactionComplete?: () => void;
};

type ItemDataProps = {
    id?: number;
	inventoryItemId?: number;
    name: string;
	rarity: string;
	type: string;
	slot?: string;
    attributes: any[];
}

export default function ItemTransaction({
	campaignUser,
	selectedCharacter,
	currentCharacter,
	item,
	showDropdown,
	onTransactionComplete
}: TransactionModalProps) {
	const [showTransactionModal, setShowTransactionModal] = useState(showDropdown);
	const [itemValue, setItemValue] = useState<string>("0");
	const [error, setError] = useState("");

	const handleTransactionConfirm = async (transactionType: "TRADE" | "SELL" | "GIFT" | "DROP") => {
		setError("");
		if (!selectedCharacter || !campaignUser) {
			setError("Informações do personagem ou do campaignUser estão faltando.");
			return
		}

		if (transactionType === "SELL" && (!itemValue || Number(itemValue) <= 0)) {
			setError("Informe um valor válido para a transação.");
			return
		}

		try {
			await handleItemTransaction(campaignUser, selectedCharacter, transactionType)
			setShowTransactionModal(false)
		} catch (err: any) {
			console.error("Erro capturado no componente:", err.message);
			setError(err.message || 'Erro ao realizar a transação');
		} finally {
			setShowTransactionModal(false)
			onTransactionComplete?.();
		}
	};

	const handleItemTransaction = async (
		campaignUser: any ,
		selectedCharacter: any,
		transactionType: "TRADE" | "SELL" | "GIFT" | "DROP"
	) => {
		const payload: SaveItemPayload = {
			itemId: item.id,
			inventoryItemId: item.inventoryItemId,
			characterId: selectedCharacter.userId,
			campaignId: Number(campaignUser.campaignId),
			toInventoryId: selectedCharacter.inventoryId,
			fromInventoryId: currentCharacter?.inventoryId,
			type: item.type,
			rarity: item.rarity,
			attributes: item.attributes,
			name: item.name,
			slot: item.slot ?? "pocket",
			transactionType,
			itemValue,
		};

		const response = await fetch('/api/items/trade', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});

		const result = await response.json();

		if (!response.ok) {
			setError(result.error || 'Erro inesperado na transação');
			return;
		}
	}

	if (!showTransactionModal) return null;

	return (
		<>
			{showDropdown && (
				<ModalOverlay>
					<ModalContent>
						{error && <ErrorMessage>{error}</ErrorMessage>}
						<h3>Tipo de Transação - {item.type}</h3>
						<div className="modal-content-send-items">
							{item.type !== "currency" && (
								<button onClick={() => handleTransactionConfirm("TRADE")}>Troca</button>
							)}
							<button onClick={() => handleTransactionConfirm("GIFT")}>Doação</button>
							{campaignUser?.role === "MASTER" && (
								<button onClick={() => handleTransactionConfirm("DROP")}>Drop</button>
							)}
						</div>
			
						<div className="modal-content-sell-items">
							<button onClick={() => handleTransactionConfirm("SELL")}>Venda</button>
							<label htmlFor="item">Valor:</label>
							<input
								className="input-item-value"
								name="item-value"
								type="number"
								min="0"
								value={item.id ? itemValue : item.attributes[0].status}
								onChange={(e) => setItemValue(e.target.value)}
							/>
						</div>

						<button className="cancel" onClick={() => setShowTransactionModal(false)}>
							Cancelar
						</button>
					</ModalContent>
				</ModalOverlay>
			)}
		</>
	);
}