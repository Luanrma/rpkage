'use client';

import { useEffect, useState, RefObject } from 'react';
import styled from 'styled-components';
import { useSession } from '@/app/contexts/SessionContext';
import KageSheetForm from '@/app/components/KageSheetForm';
import { SheetModelKageForCharacter } from './sheetModel';
import { Backpack } from 'lucide-react';
import InventoryModal from '@/app/components/InventoryModal';
import { LoadingScreen } from '@/app/components/LoadingScreen';
import dragAndDrop from "@/app/utils/dragAndDrop";

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #1a1a1a;
  border-radius: 10px;
  color: #e0e0e0;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-top: 1rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  background-color: #2a2a2a;
  border: 1px solid #444;
  color: #f1f1f1;
`;

const Button = styled.button`
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #6f42c1;
  color: white;
  border: none;
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
            setError('Erro inesperado ao salvar personagem.');
        }
    };

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <Container>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <TitleRow>
                <Title>{sheet ? 'Editar Personagem' : 'Criar Personagem'}</Title>
                {characterId && (
                    <Backpack
                        size={28}
                        style={{ cursor: 'pointer' }}
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
