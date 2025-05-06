'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		const res = await fetch('/api/sign-in', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
			headers: { 'Content-Type': 'application/json' },
		})

		if (!res.ok) {
			alert('Email ou senha inválidos')
			return
		}

		const data = await res.json()
		const { name, type } = data

		// 🔒 Não salva em localStorage (por segurança)

		// Redireciona baseado no tipo
		if (type === 'MASTER' || type === 'ADMIN') {
			router.push('/home')
		} else {
			router.push('/')
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
			<input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
			<input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
			<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Entrar</button>
		</form>
	)
}
