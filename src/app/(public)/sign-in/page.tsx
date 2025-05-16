'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'

const LoginContainer = styled.div`
	@keyframes pulse-slow {
		0%, 100% { opacity: 0.15; transform: scale(1); }
		50% { opacity: 0.25; transform: scale(1.05); }
	}

	.animate-pulse-slow {
		animation: pulse-slow 8s ease-in-out infinite;
	}

	button {
		cursor:pointer;
	}
`

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

		router.push('/')
	}

	return (
		<LoginContainer>
			<div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 animate-background flex items-center justify-center relative overflow-hidden">
				{/* Fundo animado com movimento sutil */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-800 via-purple-900 to-black opacity-20 animate-pulse-slow blur-3xl z-0" />
				
				<form
					onSubmit={handleSubmit}
					className="z-10 bg-gray-900 p-8 rounded-xl shadow-xl flex flex-col gap-6 w-sm text-white"
				>
					<h2 className="text-2xl font-semibold text-center mb-2">Login</h2>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
						className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
					<input
						type="password"
						placeholder="Senha"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
						className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
					<button
						type="submit"
						className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-semibold py-2 rounded"
					>
						Entrar
					</button>
				</form>
			</div>
		</LoginContainer>
	)
}
