import { useEffect, useState } from "react";
import styled from "styled-components";
import ReactDOM from 'react-dom';
import InventoryModalItemDetails from "../InventoryModalItemDetails";
import BagItemIcon from "../BagItemIcon";
import { Wallet } from "@prisma/client";
import { useSession } from "@/app/contexts/SessionContext";
import ModalTransactionSelectCharacter from "../ModalTransactionSelectCharacter";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalBox = styled.div`
  position: relative;
  background: #2a2a2a;
  padding: 1rem;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  color: #fff;
`;

const CloseButton = styled.button`
  background: #444;
  color: #fff;
  border: none;
  padding: 0.2rem 1rem;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background: #666;
  }
`;

const GridContainer = styled.div`
  padding: 0.4rem;
  display: grid;
  background-color: rgb(36, 35, 35);
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
  height: 100%;
  border: 0.1rem solid rgb(124, 124, 124); /* Borda ao redor do grid */
  border-radius: 8px;
`;

const GridItem = styled.div`
  background-color: rgb(36, 35, 35); /* Fundo para as células */
  border: 1px dashed rgb(124, 124, 124); /* Borda das células do grid */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    border: 1px solid rgb(53, 53, 53);
    background-color: #555;
  }
`;

const ItemIcon = styled.span`
  font-size: 2rem;
`;

const CurrencyContainer = styled.div`
	padding: .5rem .5rem 0 0;
	display: flex;
    align-items: center;
    justify-content: flex-end;
	gap: 0.5rem;

	span {
		font-size: 1.1rem;
	}
`

export type ItemAttributes = {
    dice: string;
    status: string;
    description: string;
};

type ItemDefinition = {
    type: string;
};

type ItemDetail = {
    id: string;
    campaingId: string;
    type: string;
    rarity: string;
    name: string;
    slot: string;
    attributes: {
        opt_1: ItemAttributes | null;
        opt_2: ItemAttributes | null;
        opt_3: ItemAttributes | null;
        opt_4: ItemAttributes | null;
        definition: ItemDefinition;
    };
};

export type InventoryItem = {
    id: bigint;
    inventoryId: bigint;
    itemsId: bigint;
    createdAt: Date;
    updatedAt: Date;
    item: ItemDetail;
};

export default function InventoryModal({ characterId, onClose }: { characterId: string; onClose: () => void }) {
	const { campaignUser } = useSession()

	const [items, setItems] = useState<InventoryItem[]>([]);
	const [wallet, setWallet] = useState<Wallet | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedItem, setSelectedItem] = useState<any | null>(null);
	const [showDropdownCurrency, setShowDropdownCurrency] = useState(false);

	useEffect(() => {
		if (!campaignUser) {
			return
		}

		fetchInventory();
	}, [campaignUser]);

	const fetchInventory = async () => {
		try {
			setLoading(true);
			setItems([])
			setWallet(null)
			setSelectedItem(null)

			const res = await fetch(`/api/inventory-and-wallet/by-character/${characterId}`)
			const inventoryAndWallet = await res.json()

			setItems(inventoryAndWallet?.inventoryItems || [])
			setWallet(inventoryAndWallet?.character.Wallet[0] || [])
			setLoading(false);
		} catch (error) {
			console.error('Erro ao buscar inventário:', error);
		}
	};

	const handleUpdateInventory = async () => {
		try {
			setItems(prevItems => prevItems.filter(item => item.id !== selectedItem.id));
			setSelectedItem(null); // opcional, se quiser fechar os detalhes após envio
		} catch (error) {
			console.error('Erro ao atualizar inventário: ', error);
		}
	}

	const handleUpdateWallet = async (transferredAmount: number) => {
		if (!wallet) {
			return
		}
		const actualAmount = Number(wallet.amount) - transferredAmount
		setWallet(prev => prev ? { ...prev, amount: actualAmount.toString() } : prev)
	}

	const handleWalletData = () => {
		if (!wallet) {
			return
		}
		const walletData = {
			amountOrigin: "characterInventory",
			amount: wallet.amount
		}
		return walletData
	}

	const handleCurrencyDropDown = () => {
		if (!wallet) {
			return;
		}
		setShowDropdownCurrency(!showDropdownCurrency)
	}

	if (!campaignUser) {
		return
	}

	return ReactDOM.createPortal(
		<Overlay onClick={onClose}>
			<ModalBox onClick={(e) => e.stopPropagation()}>
				<CloseButton onClick={onClose}>X</CloseButton>
				{loading ? (
					<p style={{position:"absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>Carregando itens...</p>
				) : items.length > 0 ? (
					<GridContainer>
						{items.map((inv) => (
							<GridItem
								key={inv.id.toString()}
								onClick={() => setSelectedItem(inv)}
								title={inv.item?.name || 'Item desconhecido'}
							>
								<ItemIcon><BagItemIcon iconName={inv.item.slot} /></ItemIcon>
							</GridItem>
						))}
					</GridContainer>
				) : (
					<GridContainer>
						Vazio
					</GridContainer>
				)}

				<CurrencyContainer 
					title={campaignUser?.campaign.currencyName || "currency"}
					onClick={() => handleCurrencyDropDown()}
				>
					<div style={{ display: "flex", textAlign: 'center', alignItems: "center", gap: "0.4rem", cursor: "pointer"}}>
						<ItemIcon>
							<BagItemIcon iconName="brics" />
						</ItemIcon>
						<span>{wallet?.amount ?? '0'}</span>
					</div>
				</CurrencyContainer>

				{/* Verifica se há um item selecionado e exibe os detalhes no modal */}
				{selectedItem && (
					<InventoryModalItemDetails 
						inventoryItem={selectedItem}
						onInventoryChange={handleUpdateInventory}
					/>
				)}

				{wallet && showDropdownCurrency && (
					<ModalTransactionSelectCharacter 
						walletData={handleWalletData()}
						onWalletTransactionComplete={handleUpdateWallet} 
					/>
				)}
			</ModalBox>
		</Overlay>,
		document.body
	);
}
