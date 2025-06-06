import { useSession } from "@/app/contexts/SessionContext";
import { useEffect, useState } from "react";
import styled from "styled-components";
import ItemTransaction from "../ItemTransaction";
import { RefreshCcw } from 'lucide-react';
import useRequest from "@/app/hooks/use-request";

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

const ButtonForceUpdate = styled.button`
  padding: 0.2rem;
  margin-bottom: .5rem;
  cursor: pointer;
  color: #eee;
`

type Character = {
    id: string;
    userId: number;
    inventoryId: number;
    walletId: number;
    name: string;
    role: string;
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

type ModalTransactionSelectCharacterProps = {
    itemData?: ItemDataProps
    walletData?: WalletDataProps,
    onTransactionComplete?: () => void;
    onWalletTransactionComplete?: (transferredAmount: number) => void;
}

export default function ModalTransactionSelectCharacter({ itemData, walletData, onTransactionComplete, onWalletTransactionComplete }: ModalTransactionSelectCharacterProps) {
    const { campaignUser } = useSession();

    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showCharacterSelectorModal, setShowCharacterSelectorModal] = useState(true)
    const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
    const [otherCharacters, setOtherCharacters] = useState<Character[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const { doRequest } = useRequest();

    useEffect(() => {
        if (!campaignUser) {
            return
        }
        const fetchData = async () => {
            const res = await doRequest({
                url: `/api/characters/by-campaign-and-not-user/${campaignUser!.campaignId}/${campaignUser!.userId}`,
                method: 'get',
                cache: true
            });
            setOtherCharacters(res.othersPlayer);
            setCurrentCharacter(res.currentPlayer);
        }
        if (showTransactionModal) {
            setShowCharacterSelectorModal(false);
        }
        fetchData();

    }, [campaignUser, showTransactionModal]);

    const handleRefresh = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await doRequest({
            url: `/api/characters/by-campaign-and-not-user/${campaignUser!.campaignId}/${campaignUser!.userId}`,
            method: 'get',
        });
        setOtherCharacters(res.othersPlayer);
        setCurrentCharacter(res.currentPlayer);

    }

    if (!campaignUser) {
        return
    }

    return (
        <>
            {showCharacterSelectorModal && (
                <Dropdown>
                    <ButtonForceUpdate onClick={handleRefresh}><RefreshCcw /></ButtonForceUpdate>
                    {otherCharacters.map((char) => (
                        <DropdownItem key={char.id} onClick={() => {
                            setSelectedCharacter(char);
                            setShowTransactionModal(true);
                        }}>
                            {char.name} <span className={`char-role-${char.role}`}>{char.role}</span>
                        </DropdownItem>
                    ))}
                </Dropdown>
            )}

            {showTransactionModal && selectedCharacter && currentCharacter && itemData && !walletData && (
                <ItemTransaction
                    campaignUser={campaignUser}
                    selectedCharacter={selectedCharacter}
                    currentCharacter={currentCharacter}
                    item={itemData}
                    onTransactionComplete={onTransactionComplete}
                />
            )}

            {showTransactionModal && selectedCharacter && currentCharacter && walletData && (
                <ItemTransaction
                    campaignUser={campaignUser}
                    selectedCharacter={selectedCharacter}
                    currentCharacter={currentCharacter}
                    walletData={walletData}
                    onWalletTransactionComplete={onWalletTransactionComplete}
                />
            )}
        </>
    )
}