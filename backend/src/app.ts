import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { openapiSpec } from './swagger/openapi';
import { booksRouter } from './modules/books/book.routes';
import { authRouter } from './modules/auth/auth.routes';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/books', booksRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));



app.get('/', (_req, res) => {
  res.json({ message: 'API funcionando correctamente 🚀' });
});
