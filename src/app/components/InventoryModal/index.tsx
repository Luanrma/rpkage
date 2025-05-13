import { useEffect, useState } from "react";
import styled from "styled-components";
import ReactDOM from 'react-dom';
import InventoryModalItemDetails from "../InventoryModalItemDetails";
import BagItemIcon from "../BagItemIcon";

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

const MonetaryContainer = styled.div`
	padding: .5rem .5rem 0 0;
	display: flex;
    align-items: center;
    justify-content: flex-end;
	gap: 0.5rem;

	span {
		font-size: 1.1rem;
	}
`

export default function InventoryModal({ characterId, onClose }: { characterId: string; onClose: () => void }) {
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedItem, setSelectedItem] = useState<any | null>(null);

	useEffect(() => {
		const fetchInventory = async () => {
			try {
				const res = await fetch(`/api/inventory/by-character/${characterId}`);
				const data = await res.json();
				// Acessa diretamente o array de items dentro de inventoryItems
				const inventoryItems = data[0]?.inventoryItems || [];
				setItems(inventoryItems); // Atualiza o estado com os itens do inventário
			} catch (error) {
				console.error('Erro ao buscar inventário:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchInventory();
	}, [characterId]);

	return ReactDOM.createPortal(
		<Overlay onClick={onClose}>
			<ModalBox onClick={(e) => e.stopPropagation()}>
				<CloseButton onClick={onClose}>X</CloseButton>
				{loading ? (
					<p>Carregando itens...</p>
				) : items.length > 0 ? (
					<GridContainer>
						{items.map((inv, idx) => (
							<GridItem
								key={idx}
								onClick={() => setSelectedItem(inv.item)}
								title={inv.item?.name || 'Item desconhecido'}
							>
								<ItemIcon><BagItemIcon iconName={inv.item.type} /></ItemIcon>
							</GridItem>
						))}
					</GridContainer>
				) : (
					<GridContainer>
						Vazio
					</GridContainer>
				)}

				<MonetaryContainer>
					<ItemIcon>
						<BagItemIcon iconName="brics" />
					</ItemIcon>

					<span>0</span>
				</MonetaryContainer>

				{/* Verifica se há um item selecionado e exibe os detalhes no modal */}
				{selectedItem && (
					<InventoryModalItemDetails item={selectedItem} />
				)}
			</ModalBox>
		</Overlay>,
		document.body
	);
}
