import jwt, { SignOptions, Secret } from 'jsonwebtoken'
import { StringValue } from 'ms'

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret

if (!JWT_SECRET) {
	throw new Error('JWT_SECRET não está definido no .env')
}

type TokenPayload = {
	id: string
	name: string
	email: string
	type: string
	campaignUserId?: string
}

export function signToken(payload: TokenPayload, expiresIn: number | StringValue = '7d'): string {
	const options: SignOptions = { expiresIn }
	return jwt.sign(payload, JWT_SECRET, options)
}

export function verifyToken(token: string): TokenPayload | null {
	try {
		return jwt.verify(token, JWT_SECRET) as TokenPayload
	} catch {
		return null
	}
}
