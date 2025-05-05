'use client'; // Garante que este componente será executado no lado do cliente

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importação correta para Next.js 13 com App Router
import { LogOut } from 'lucide-react';
import styled from 'styled-components';

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  cursor: pointer;
  color: rgb(117, 117, 117);
  margin-top: auto;

  &:hover {
    color: rgb(255, 255, 255);
    transform: translateX(5px);
  }

  svg {
    flex-shrink: 0;
  }
`;

export default function Logout() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Este efeito só é executado no lado do cliente
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    // Fazer uma requisição para o backend para remover o cookie
    const response = await fetch('/api/logout', {
      method: 'POST',
    });

    if (response.ok) {
      // Redirecionar para a página de login após logout
      router.push('/sign-in');
    } else {
      console.error('Erro ao realizar logout');
    }
  };

  if (!isClient) {
    return null; // Não renderiza nada até que seja no lado do cliente
  }

  return (
    <LogoutButton onClick={handleLogout}>
      <LogOut />
    </LogoutButton>
  );
}
