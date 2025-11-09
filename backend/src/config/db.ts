import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { Book } from '../modules/books/book.entity';
import { User } from '../modules/auth/user.entity';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: env.db.host,
  port: env.db.port,
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,
  synchronize: false, 
  logging: false,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  entities: [Book, User]
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log('Conectado a SQL Server');
  } catch (error) {
    console.error('Error conectando a SQL Server:', error);
  }
}
