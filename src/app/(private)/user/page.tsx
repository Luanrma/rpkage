'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useSession } from '../../contexts/SessionContext';

const UsersContainer = styled.div`
  width: 100vw;
  background-color: #111;
  color: #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const UsersTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #444;
  background-color: #222;
  color: #fff;
`;

const SearchButton = styled.button`
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  border-radius: 6px;
  border: none;
  background-color: #6b21a8;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #7c3aed;
  }
`;

const UsersList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 700px;
`;

const UserItem = styled.li`
  background-color: #222;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserAvatarPlaceholder = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.p`
  font-weight: bold;
  font-size: 1.2rem;
`;

const UserEmail = styled.p`
  font-size: 0.9rem;
  color: #aaa;
`;

const UserRole = styled.p`
  font-size: 0.85rem;
  color: #8b5cf6;
  margin-top: 2px;
`;

const AddButton = styled.button`
  padding: 0.3rem 1rem;
  font-size: 0.9rem;
  border-radius: 4px;
  border: none;
  background-color: #22c55e;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #16a34a;
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const AddedUsersTitle = styled.h2`
  font-size: 1.5rem;
  margin-top: 2rem;
`;

const AddedUsersList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 700px;
`;

interface User {
	id: string;
	name: string;
	email: string;
	password: string;
	avatar: string | null;
	type: string;
	active: boolean;
}

interface CampaignUserRecord {
	userId: string;
	role: string;
	name: string;
	email: string;
	avatar: string | null;
}

export default function CampaignUserManagementPage() {
	const { campaignUser } = useSession();
	const [searchResultUsers, setSearchResultUsers] = useState<User[]>([]);
	const [searchEmail, setSearchEmail] = useState('');
	const [campaignExistingUserIds, setCampaignExistingUserIds] = useState<string[]>([]);
	const [campaignUsers, setCampaignUsers] = useState<CampaignUserRecord[]>([]);
	const router = useRouter();

	useEffect(() => {
		if (!campaignUser) return;

		if (campaignUser.role !== 'MASTER') {
			router.push('/');
			return;
		}

		fetchCampaignUsers();
	}, [campaignUser]);

	const fetchCampaignUsers = async () => {
		if (!campaignUser?.campaignId) return;

		try {
			const response = await fetch(`/api/campaign-user/by-campaign/${campaignUser.campaignId}`);
			const responseData = await response.json();

			if (!Array.isArray(responseData)) {
				console.warn('Resposta da API não é um array:', responseData);
				return;
			}

			const userIds = responseData.map((record: any) => record.userId.toString());

			setCampaignExistingUserIds(userIds);
			setCampaignUsers(
				responseData.map((record: any) => ({
					userId: record.user.id,
					role: record.role,
					name: record.user.name,
					email: record.user.email,
					avatar: record.user.avatar || null,
				}))
			);
		} catch (error) {
			console.error('Erro ao buscar campaign users:', error);
		}
	};

	const handleSearch = async (event: React.FormEvent) => {
		event.preventDefault();

		const response = await fetch(`/api/users/by-email/${encodeURIComponent(searchEmail)}`);
		if (!response.ok) return;

		const userData = await response.json();
		const formattedUsers = Array.isArray(userData) ? userData : [userData];
		setSearchResultUsers(formattedUsers);
	};

	const handleAddUserToCampaign = async (userId: string) => {
		if (!campaignUser) return;

		const response = await fetch('/api/campaign-user', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				campaignId: campaignUser.campaignId,
				userId,
				role: 'PLAYER',
			}),
		});

		if (response.ok) {
			await fetchCampaignUsers(); // Atualiza a lista
		}
	};

	if (!campaignUser) {
		return <p>Carregando...</p>;
	}

	return (
		<UsersContainer>
			<UsersTitle>Gerenciar Usuários da Campanha</UsersTitle>

			<SearchForm onSubmit={handleSearch}>
				<SearchInput
					type="text"
					placeholder="Buscar por email"
					value={searchEmail}
					onChange={(e) => setSearchEmail(e.target.value)}
				/>
				<SearchButton type="submit">Buscar</SearchButton>
			</SearchForm>

			<UsersList>
				{searchResultUsers.map((user) => (
					<UserItem key={user.id}>
						<UserInfo>
							{user.avatar ? (
								<UserAvatar src={user.avatar} alt={user.name} />
							) : (
								<UserAvatarPlaceholder>👤</UserAvatarPlaceholder>
							)}
							<UserDetails>
								<UserName>{user.name}</UserName>
								<UserEmail>{user.email}</UserEmail>
							</UserDetails>
						</UserInfo>
						<AddButton
							onClick={() => handleAddUserToCampaign(user.id)}
							disabled={campaignExistingUserIds.includes(user.id)}
						>
							{campaignExistingUserIds.includes(user.id) ? 'Já Adicionado' : 'Adicionar'}
						</AddButton>
					</UserItem>
				))}
			</UsersList>

			{campaignUsers.length > 0 && (
				<>
					<AddedUsersTitle>Usuários Adicionados à Campanha</AddedUsersTitle>
					<AddedUsersList>
						{campaignUsers.map((user) => (
							<UserItem key={user.userId}>
								<UserInfo>
									{user.avatar ? (
										<UserAvatar src={user.avatar} alt={user.name} />
									) : (
										<UserAvatarPlaceholder>👤</UserAvatarPlaceholder>
									)}
									<UserDetails>
										<UserName>{user.name}</UserName>
										<UserEmail>{user.email}</UserEmail>
										<UserRole>Função: {user.role}</UserRole>
									</UserDetails>
								</UserInfo>
							</UserItem>
						))}
					</AddedUsersList>
				</>
			)}
		</UsersContainer>
	);
}
