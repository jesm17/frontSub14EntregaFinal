import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { API_URL } from '../api';
import { User } from '../models';

const TOKEN_KEY = 'frontsub14-token';
const USER_KEY = 'frontsub14-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(this.readUser());

  constructor(private readonly http: HttpClient) {}

  login(payload: { email: string; password: string }) {
    return this.http
      .post<{ accessToken: string; user: User }>(`${API_URL}/auth/login`, payload)
      .pipe(tap((res) => this.storeSession(res.accessToken, res.user)));
  }

  signup(payload: { name: string; email: string; password: string }) {
    return this.http
      .post<{ accessToken: string; user: User }>(`${API_URL}/auth/signup`, payload)
      .pipe(tap((res) => this.storeSession(res.accessToken, res.user)));
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  token() {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAdmin() {
    return this.currentUser()?.role === 'admin';
  }

  private storeSession(token: string, user: User) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private readUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
