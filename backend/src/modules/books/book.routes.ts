import { Router } from 'express';
import { BookController } from './book.controller';
import { requireAuth } from '../auth/auth.middleware';

export const booksRouter = Router();
booksRouter.get('/', BookController.list);
booksRouter.get('/:id', BookController.get);
booksRouter.post('/', requireAuth, BookController.create);
booksRouter.put('/:id', requireAuth, BookController.update);
booksRouter.delete('/:id', requireAuth, BookController.remove);
