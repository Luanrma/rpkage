'use client';

import { useState } from 'react';
import { InterfaceItemGenerator } from '@/engine/ItemGenerators/Interfaces/ItemGenerator';
import styled from 'styled-components';
import { Send } from 'lucide-react';
import ItemTransaction from '../ItemTransaction';

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
	const [showDropdown, setShowDropdown] = useState(false);

	return (
		<Card>
			<SaveIcon onClick={() => setShowDropdown(prev => !prev)}>
				<Send />
			</SaveIcon>

			{showDropdown && (
				<div>
					<ItemTransaction
						showDropdown={showDropdown}
						type={type}
						rarity={rarity}
						attributes={attributes}
						name={name}
						slot={slot}
						itemId={id}
						inventoryItemId={inventoryItemId}
						onTransactionComplete={onTransactionComplete}
					/>
				</div>
			)}

			<h3 className={`rarity-${rarity}`}>{`${type.toLocaleUpperCase()} (${rarity})`}</h3>
			<strong className="item-model">{slot}</strong>
			<hr />
			<ul>
				{attributes.map((opt, i) => (
					<li key={i}>{`${opt.description} ${opt.status} ${opt.diceBonus ?? ''}`}</li>
				))}
			</ul>
		</Card>
	);
}