import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'feedlink-dev-secret';

export interface TokenPayload {
  id: string;
  role: string;
  email: string;
}

export const signToken = (payload: TokenPayload): string =>
  jwt.sign(payload, SECRET, { expiresIn: '7d' });

export const verifyToken = (token: string): TokenPayload =>
  jwt.verify(token, SECRET) as TokenPayload;
