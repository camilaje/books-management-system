import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface TokenPayload {
  email?: string;
  sub?: string | number;
  role?: string;
  exp?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey: string;
  private readonly apiUrl: string;

  private _isAuthenticated$ = new BehaviorSubject<boolean>(this.isAuthenticated());
  public readonly isAuthenticated$ = this._isAuthenticated$.asObservable();

  constructor(private readonly http: HttpClient) {
    this.storageKey = 'token';
    this.apiUrl = `${environment.apiUrl}/api/auth`;
  }

  public login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => {
        if (res?.token) {
          this.saveToken(res.token, true);
          this._isAuthenticated$.next(true);
        }
      }),
      catchError((err) => {
        console.error('Error en login', err);
        return throwError(() => err);
      })
    );
  }

  public register(data: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      catchError((err) => {
        console.error('Error en registro', err);
        return throwError(() => err);
      })
    );
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = this.decode(token);
      if (!payload?.exp) return true;
      return Date.now() < payload.exp * 1000;
    } catch {
      return false;
    }
  }

  public user(): { email?: string; role?: string } | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const p = this.decode(token);
      return { email: p?.email, role: p?.role };
    } catch {
      return null;
    }
  }

  public saveToken(token: string, remember = true): void {
    if (remember) {
      localStorage.setItem(this.storageKey, token);
      sessionStorage.removeItem(this.storageKey);
    } else {
      sessionStorage.setItem(this.storageKey, token);
      localStorage.removeItem(this.storageKey);
    }
  }

  public getToken(): string | null {
    return localStorage.getItem(this.storageKey) ?? sessionStorage.getItem(this.storageKey);
  }

  public logout(): void {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.storageKey);
    this._isAuthenticated$.next(false);
  }

  private decode(token: string): TokenPayload | null {
    const [, payload] = token.split('.');
    if (!payload) return null;
    try {
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
      return null;
    }
  }
}
