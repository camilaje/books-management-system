import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type BookStatus = 'disponible' | 'reservado' | 'disponible' | 'reservado';

export interface Book {
  id?: number;
  title: string;
  author: string;
  year: number;
  status: BookStatus;
}

export interface PaginatedBooks {
  items: Book[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface BooksQuery {
  page?: number;
  limit?: number;
  q?: string;
  status?: BookStatus;
  sort?: string;
}

@Injectable({ providedIn: 'root' })
export class BooksService {
  private readonly baseUrl: string;

  constructor(private readonly http: HttpClient) {
    this.baseUrl = `${environment.apiUrl.replace(/\/$/, '')}/api/books`;
  }

  public getAll(query: BooksQuery = {}): Observable<Book[]> {
    return this.getPage(query).pipe(map((res) => res.items ?? []));
  }

  public getPage(query: BooksQuery = {}): Observable<PaginatedBooks> {
    const status =
      query.status === 'disponible'
        ? 'disponible'
        : query.status === 'reservado'
        ? 'reservado'
        : query.status;

    const paramsObj: Record<string, string> = {
      ...(query.page != null ? { page: String(query.page) } : {}),
      ...(query.limit != null ? { limit: String(query.limit) } : {}),
      ...(query.q ? { q: query.q } : {}),
      ...(status ? { status: String(status) } : {}),
      ...(query.sort ? { sort: query.sort } : {}),
    };

    const params = new HttpParams({ fromObject: paramsObj });

    return this.http.get<PaginatedBooks>(this.baseUrl, { params });
  }

  public getById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/${id}`);
  }

  public create(book: Book): Observable<Book> {
    return this.http.post<Book>(this.baseUrl, book);
  }

  public update(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/${id}`, book);
  }

  public delete(id: number): Observable<{}> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
