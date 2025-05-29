'use client';

import { useEffect, useState, RefObject } from 'react';
import styled from 'styled-components';
import { useSession } from '@/app/contexts/SessionContext';
import KageSheetForm from '@/app/components/KageSheetForm';
import { SheetModelKageForCharacter } from './sheetModel';
import { Backpack } from 'lucide-react';
import InventoryModal from '@/app/components/InventoryModal';
import { LoadingScreen } from '@/app/components/LoadingScreen';

const Container = styled.div`
  max-width: 800px;
  margin: .5rem auto;
  padding: 1rem;
  background-color: #1a1a1a;
  border-radius: 10px;
  color: #e0e0e0;

  @media (max-width: 480px) {
    padding: .2rem;
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin-bottom: 0;
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #6f42c1;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #5936a1;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  margin-top: 1rem;
`;

export default function CreateCharacterPage() {
    const [sheet, setSheet] = useState<SheetModelKageForCharacter | undefined>(undefined);
    const { campaignUser } = useSession();
    const [characterId, setCharacterId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showInventory, setShowInventory] = useState(false);

    useEffect(() => {
        const fetchCharacter = async () => {
            if (!campaignUser) return;

            try {
                const res = await fetch(`/api/characters/by-user-and-campaign/${campaignUser.userId}/${campaignUser.campaignId}`);
                if (res.ok) {
                    const data = await res.json();
                    setCharacterId(data.id);
                    setSheet(data.sheet);
                    setName(data.sheet.name);
                } else {
                    setCharacterId(null);
                    setName('');
                    setSheet(undefined);
                }
            } catch (err) {
                console.error('Erro ao buscar personagem');
            } finally {
                setLoading(false);
            }
        };

        fetchCharacter();
    }, [campaignUser]);

    const handleSubmit = async () => {
        if (!campaignUser) return;
        
        if (!sheet?.name) {
            setError('O nome do personagem é obrigatório.');
            return;
        }

        const payload = {
            userId: campaignUser.userId,
            campaignId: campaignUser.campaignId,
            role: campaignUser.role,
            sheet,
        };

        try {
            if (characterId) {
                const response = await fetch('/api/characters/update-sheet-by-id', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: characterId, payload }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || 'Erro ao editar personagem.');
                    return;
                }

                alert('Ficha editada com sucesso!');
                setCharacterId(data.id);
                return;
            }

            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Erro ao salvar personagem.');
                return;
            }

            alert('Ficha salva com sucesso!');
        } catch (err) {
            setError('Erro inesperado ao salvar ficha.');
        }
    };

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <Container>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <TitleRow>
                <Title>{sheet ? 'Editar Ficha' : 'Criar Ficha'}</Title>
                {characterId && (
                    <Backpack
                        size={35}
                        style={{ cursor: 'pointer'}}
                        onClick={() => setShowInventory(true)}
                    />
                )}
            </TitleRow>

            <KageSheetForm sheet={sheet} onChange={setSheet} />
            <Button onClick={handleSubmit}>Salvar Ficha</Button>
            
            {showInventory && characterId && (
                <InventoryModal characterId={characterId} onClose={() => setShowInventory(false)} />
            )}
        </Container>
    );
}
