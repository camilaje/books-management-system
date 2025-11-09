import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book, BooksService } from '../../services/books.service';

type BookStatus = 'disponible' | 'reservado';

type BookFormGroup = FormGroup<{
  title: FormControl<string>;
  author: FormControl<string>;
  year: FormControl<number>;
  status: FormControl<BookStatus>;
}>;

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-books.component.html',
  styleUrls: ['./create-books.component.scss'],
})
export class CreateBooksComponent implements OnInit {
  public isEdit: boolean;
  public loading: boolean;
  public bookId: number | null;
  public form: BookFormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly booksService: BooksService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.isEdit = false;
    this.loading = false;
    this.bookId = null;

    this.form = this.fb.nonNullable.group({
      title: this.fb.nonNullable.control('', { validators: [Validators.required] }),
      author: this.fb.nonNullable.control('', { validators: [Validators.required] }),
      year: this.fb.nonNullable.control(new Date().getFullYear(), {
        validators: [Validators.required, Validators.min(1)],
      }),
      status: this.fb.nonNullable.control<BookStatus>('disponible', {
        validators: [Validators.required],
      }),
    });
  }

  public get f() {
    return this.form.controls;
  }

  public ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.bookId = Number(idParam);
      this.loadBook(this.bookId);
    }
  }

  public loadBook(id: number): void {
    this.loading = true;
    this.booksService.getById(id).subscribe({
      next: (book: Book) => {
        this.form.patchValue({
          title: book.title,
          author: book.author,
          year: book.year as number,
          status: (book as any).status as BookStatus,
        });
        this.loading = false;
      },
      error: (err: unknown) => {
        console.error('Error cargando libro', err);
        this.loading = false;
      },
    });
  }

  public submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;

    const data: Book = this.form.getRawValue() as unknown as Book;

    if (this.isEdit && this.bookId !== null) {
      this.booksService.update(this.bookId, data).subscribe({
        next: () => this.router.navigate(['/books']),
        error: (err: unknown) => {
          console.error('Error actualizando', err);
          this.loading = false;
        },
      });
    } else {
      this.booksService.create(data).subscribe({
        next: () => this.router.navigate(['/books']),
        error: (err: unknown) => {
          console.error('Error creando', err);
          this.loading = false;
        },
      });
    }
  }

  public cancel(): void {
    this.router.navigate(['/books']);
  }
}
