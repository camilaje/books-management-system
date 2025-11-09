import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Book, BooksService } from '../../services/books.service';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.scss'],
})
export class BooksListComponent implements OnInit {
  public books: Book[];
  public loading: boolean;

  public page: number;
  public limit: number;
  public q: string;
  public status: 'disponible' | 'reservado' | '';
  public sort: string;

  public total: number;
  public pages: number;

  constructor(private readonly booksService: BooksService, private readonly router: Router) {
    this.books = [];
    this.loading = false;

    this.page = 1;
    this.limit = 10;
    this.q = '';
    this.status = '';
    this.sort = 'year,-title';

    this.total = 0;
    this.pages = 0;
  }

  public ngOnInit(): void {
    this.loadBooks();
  }

  public loadBooks(): void {
    this.loading = true;

    this.booksService
      .getPage({
        page: this.page,
        limit: this.limit,
        q: this.q || undefined,
        status: this.status || undefined,
        sort: this.sort || undefined,
      })
      .subscribe({
        next: (res) => {
          this.books = res.items ?? [];
          this.page = res.page ?? this.page;
          this.limit = res.limit ?? this.limit;
          this.total = res.total ?? 0;
          this.pages = res.pages ?? 1;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  public search(): void {
    this.page = 1;
    this.loadBooks();
  }

  public changeLimit(limit: number): void {
    this.limit = limit;
    this.page = 1;
    this.loadBooks();
  }

  public nextPage(): void {
    if (this.page < this.pages) {
      this.page++;
      this.loadBooks();
    }
  }

  public prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadBooks();
    }
  }

  public sortBy(col: 'title' | 'author' | 'year' | 'status'): void {
    const parts = (this.sort || '').split(',').filter(Boolean);
    const idx = parts.findIndex((p) => p.replace('-', '') === col);

    if (idx >= 0) {
      parts[idx] = parts[idx].startsWith('-') ? col : `-${col}`;
    } else {
      parts.unshift(col);
    }

    this.sort = parts.join(',');
    this.page = 1;
    this.loadBooks();
  }

  public newBook(): void {
    this.router.navigate(['/books/new']);
  }

  public editBook(id: number): void {
    this.router.navigate(['/books/edit', id]);
  }

  public deleteBook(id: number): void {
    const ok: boolean = confirm('¿Seguro que deseas eliminar este libro?');
    if (!ok) return;

    this.loading = true;
    this.booksService.delete(id).subscribe({
      next: () => this.loadBooks(),
      error: () => this.loadBooks(),
    });
  }
}
