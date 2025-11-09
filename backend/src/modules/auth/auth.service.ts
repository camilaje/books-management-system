import { AppDataSource } from '../../config/db';
import { User } from './user.entity';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { logger } from '../../config/logger';


const repo = () => AppDataSource.getRepository(User);

export async function register(email: string, password: string) {
  const exists = await repo().findOne({ where: { email } });
  if (exists) throw new Error('Email ya registrado');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = repo().create({ email, passwordHash });
  await repo().save(user);
  logger.info(`Nuevo usuario registrado: ${email}`);
  return { id: user.id, email: user.email };
}

export async function login(email: string, password: string) {
  const user = await repo().findOne({ where: { email } });
  if (!user) throw new Error('Credenciales inválidas');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error('Credenciales inválidas');
  logger.info(`Usuario autenticado: ${email}`);
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwt.secret, { expiresIn: '1d' });
  return { token };
}
