import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SaveItemPayload, SaveWalletPayload } from '@/app/services/itemService/itemService';
import { LoadingScreen } from '../LoadingScreen';

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
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #6f3dbe;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-width: 200px;
  max-width: 90%;

  h3 {
    color: #fff;
    margin-bottom: 1rem;
  }


  .modal-content-send-items {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
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
  	padding: 8px 16px;
  	font-weight: bold;
    background: transparent;
    color: #ccc;
	transition: 0.3s;
    border: 1px solid #555;
    margin-top: 1rem;
	cursor: pointer;
	border-radius: 8px;

    &:hover {
      background: #3a3a3a;
    }
  }
`

const TransactionButton = styled.button<{ isProcessing?: boolean }>`
	padding: 8px 16px;
	border-radius: 8px;
	font-weight: bold;
	transition: 0.3s;
	background-color: ${({ isProcessing }) => (isProcessing ? 'rgb(103, 103, 104)' : 'rgb(111, 61, 190)')};
	color: white;
	opacity: ${({ isProcessing }) => (isProcessing ? 0.6 : 1)};
	cursor: ${({ isProcessing }) => (isProcessing ? "allowed" : "pointer")};

	&:hover {
		background-color: rgb(80, 5, 151);
	}
`

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
	item?: ItemDataProps;
	walletData?: WalletDataProps;
	onTransactionComplete?: () => void;
	onWalletTransactionComplete?: (transferredAmount: number) => void;
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

type WalletDataProps = {
	amountOrigin: string
	amount: string
}

export default function ItemTransaction({
	campaignUser,
	selectedCharacter,
	currentCharacter,
	item,
	walletData,
	onTransactionComplete,
	onWalletTransactionComplete
}: TransactionModalProps) {
	const [isProcessing, setIsProcessing] = useState(false);
	const [showTransactionModal, setShowTransactionModal] = useState(true);
	const [itemValue, setItemValue] = useState<string>("0");
	const [error, setError] = useState("");

	const handleTransactionConfirm = async (transactionType: "TRADE" | "SELL" | "GIFT" | "DROP") => {
		setIsProcessing(true);
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
			const success = await handleItemTransaction(campaignUser, selectedCharacter, transactionType);
			if (success) {
				setShowTransactionModal(false);
			}
		} catch (err: any) {
			console.error("Erro capturado no componente:", err.message);
			setError(err.message || 'Erro ao realizar a transação');
		} finally {
			setIsProcessing(false)
		}
	}

	const handleItemTransaction = async (
		campaignUser: any,
		selectedCharacter: any,
		transactionType: "TRADE" | "SELL" | "GIFT" | "DROP"
	): Promise<boolean> => {
		if (item && !walletData) {
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
			}
			return await sendItemTransaction(payload)
		}

		if (walletData && !item) {
			const payload: SaveWalletPayload = {
				campaignId: Number(campaignUser.campaignId),
				transactionType,
				toWalletId: selectedCharacter.walletId,
				amount: itemValue,
				fromWalletId: walletData.amountOrigin === "itemGenerator" ? null : currentCharacter?.walletId
			}
			return await sendWalletTransaction(payload)
		}

		return false
	}

	const sendItemTransaction = async (payload: SaveItemPayload): Promise<boolean> => {
		try {
			const response = await fetch('/api/items/trade', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const result = await response.json();
			if (!response.ok) {
				setError(result.error || 'Erro inesperado na transação');
				return false;
			}

			onTransactionComplete?.();
			return true;
		} catch (error: any) {
			setError(error.message || 'Erro na requisição');
			return false;
		}
	}

	const sendWalletTransaction = async (payload: SaveWalletPayload) => {
		try {
			const response = await fetch('/api/wallet/trade', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const result = await response.json();

			if (!response.ok) {
				setError(result.error || 'Erro inesperado na transação');
				return false;
			}

			onWalletTransactionComplete?.(Number(payload.amount));
			return true;

		} catch (error: any) {
			setError(error.message || 'Erro na requisição');
			return false;
		}
	};

	const isFromGenerator = walletData?.amountOrigin === "itemGenerator";
	useEffect(() => {
		if (isFromGenerator && walletData?.amount) {
			setItemValue(walletData.amount);
		}
	}, [walletData, isFromGenerator]);

	if (!showTransactionModal) return null;

	return (
		<>
			{showTransactionModal && (
				<ModalOverlay>
					<ModalContent>
						{error && <ErrorMessage>{error}</ErrorMessage>}
						<h3>Tipo de Transação</h3>
						<div className="modal-content-send-items">
							<TransactionButton
								isProcessing={isProcessing}
								onClick={() => handleTransactionConfirm("TRADE")}
								disabled={isProcessing}
							>Trade
							</TransactionButton>
							{campaignUser?.role === "MASTER" && (
								<TransactionButton
									isProcessing={isProcessing}
									onClick={() => handleTransactionConfirm("DROP")}
									disabled={isProcessing}
								>Drop
								</TransactionButton>
							)}
						</div>

						{walletData && !item && (
							<div className="modal-content-sell-items">
								<label htmlFor="item">Valor:</label>
								<input
									className="input-item-value"
									name="item-value"
									type="number"
									min="0"
									value={itemValue}
									readOnly={isFromGenerator}
									onChange={(e) => setItemValue(e.target.value)}
								/>
							</div>
						)}
						<button className="cancel" onClick={() => setShowTransactionModal(false)}>
							Cancelar
						</button>
					</ModalContent>
				</ModalOverlay>
			)}
		</>
	);
}