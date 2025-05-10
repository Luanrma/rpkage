'use client'; // Garante que este componente será executado no lado do cliente

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importação correta para Next.js 13 com App Router
import styled from 'styled-components';

const ButtonLogout = styled.a`
	cursor: pointer;
`

export default function Logout({ children }: { children: React.ReactNode }) {
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
		<ButtonLogout onClick={handleLogout}>{ children }</ButtonLogout>
	);
}
