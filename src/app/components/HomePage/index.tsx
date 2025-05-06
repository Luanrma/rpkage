'use client'

import { User } from '@prisma/client'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color:rgb(12, 12, 12);
`

const Content = styled.div`
  background: rgba(207, 206, 206, 0.1);
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  text-align: center;

  h1 {
    margin-bottom: 1rem;
    font-size: 2rem;
    color: rgba(248, 245, 245);
  }

  p {
    margin: 0.5rem 0;
    color: rgba(255, 255, 255);
  }
`

export default function HomePage() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        async function loadUser() {
            const res = await fetch('/api/me')
            if (res.ok) {
                const data = await res.json()
                setUser(data)
            }
        }
        loadUser()
    }, [])

    if (!user) return <p>Carregando...</p>
    return (
        <Container>
            <Content>
                <h1>Bem-vindo, {user.name}!</h1>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Tipo de usuário:</strong> {user.type}</p>
            </Content>
        </Container>
    )
}
