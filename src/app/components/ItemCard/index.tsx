'use client';

import { InterfaceItemGenerator } from '@/engine/ItemGenerators/Interfaces/ItemGenerator';
import styled from 'styled-components';

const Card = styled.div`
    background-color: #262626;
    border: 1px solid #444;
    border-radius: 10px;
    padding: 16px;
    margin: 12px 0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    color: #fff;
    text-align: left;

    .rarity-common {
        color: #a0a0a0;
    }

    .rarity-uncommon {
        color: #ffffff;
    }

    .rarity-rare {
        color: #4a90e2;
    }

    .rarity-epic {
        color: #9b59b6;
    }

    .rarity-legendary {
        color: #e67e22;
    }

    .item-model {
        font-size: 14px;
        color: #b0b0b0;
        font-weight: 500;
        margin-top: -8px;
        margin-bottom: 8px;
        letter-spacing: 0.5px;
    }
`;

export default function ItemCard({ type, rarity, model, options }: InterfaceItemGenerator ) {
    let count = 1;
    return (
        <Card>
            <h3 className={`rarity-${rarity}`}>{`${type.toLocaleUpperCase()} (${rarity})`}</h3>
            <strong className="item-model">{model}</strong>
            <hr/>
            <ul>
                {options.map(opt => 
                    <li key={count++}>{`${opt.description} ${opt.status} ${showDiceBonusIfExists(opt.diceBonus)}`}</li>
                )}
            </ul>
        </Card>
    );
}

const showDiceBonusIfExists = function(diceBonus?: string): string {
    return diceBonus ? ` + ${diceBonus}` : ""
}
