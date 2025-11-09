import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/components/login/login.component';
import { BooksListComponent } from './core/books/components/list-books/list-books.component';
import { authGuard } from './core/guards/auth.guard';
import { CreateBooksComponent } from './core/books/components/create-books/create-books.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'books', component: BooksListComponent, canActivate: [authGuard] },
  { path: 'books/new', component: CreateBooksComponent, canActivate: [authGuard] },
  { path: 'books/edit/:id', component: CreateBooksComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
