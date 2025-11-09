import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const token = h.split(' ')[1];
    (req as any).user = jwt.verify(token, env.jwt.secret);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
