import jwt, { SignOptions, Secret } from 'jsonwebtoken'
import { StringValue } from 'ms'

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não está definido no .env')
}

export function signToken(payload: object, expiresIn: number | StringValue = '7d'): string {
  console.log("AQUIIII: ", payload)
  const options: SignOptions = { expiresIn }
  return jwt.sign(payload, JWT_SECRET, options)
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}
