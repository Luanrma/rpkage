'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';

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
  transition: background-color 0.3s;

  &:hover {
    background-color: #333;
  }
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

const UserName = styled.p`
  font-weight: bold;
  font-size: 1.2rem;
`;

const UserEmail = styled.p`
  font-size: 0.9rem;
  color: #aaa;
`;

const UserStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
`;

const UserType = styled.span`
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  background-color: #6b21a8;
  color: white;
`;

const UserActive = styled.span`
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;

  &.active {
    background-color: #22c55e;
    color: white;
  }

  &.inactive {
    background-color: #ef4444;
    color: white;
  }
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

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(data);
        }
        fetchUsers();
    }, []);

    return (
        <UsersContainer>
            <UsersTitle>Lista de Usuários</UsersTitle>
            <UsersList>
                {users.map(user => (
                    <UserItem key={user.id}>
                        <UserInfo>
                            {user.avatar ? (
                                <UserAvatar src={user.avatar} alt={user.name} />
                            ) : (
                                <UserAvatarPlaceholder>👤</UserAvatarPlaceholder>
                            )}
                            <div>
                                <UserName>{user.name}</UserName>
                                <UserEmail>{user.email}</UserEmail>
                            </div>
                        </UserInfo>
                        <UserStatus>
                            <UserType className={user.type.toLowerCase()}>
                                {user.type}
                            </UserType>
                            <UserActive className={user.active ? 'active' : 'inactive'}>
                                {user.active ? 'Ativo' : 'Inativo'}
                            </UserActive>
                        </UserStatus>
                    </UserItem>
                ))}
            </UsersList>
        </UsersContainer>
    );
}
