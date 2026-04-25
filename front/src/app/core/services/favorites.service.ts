import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api';
import { catchError, map, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  favoriteIds = signal<Set<string>>(new Set());

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
  ) {}

  list() {
    return this.http.get<Array<{ gameId: string }>>(`${API_URL}/favorites/me`).pipe(
      tap((items) => this.favoriteIds.set(new Set(items.map((item) => item.gameId)))),
      catchError(() => {
        this.favoriteIds.set(new Set());
        return of([]);
      }),
    );
  }

  toggle(gameId: string) {
    if (!this.authService.currentUser()) {
      this.toastService.show('No tienes sesión iniciada', 'error');
      return of({ gameId, isFavorite: false });
    }

    return this.http
      .post<{ gameId: string; isFavorite: boolean }>(`${API_URL}/favorites/toggle`, {
        gameId,
      })
      .pipe(
        tap((res) => {
          const next = new Set(this.favoriteIds());
          if (res.isFavorite) next.add(res.gameId);
          else next.delete(res.gameId);
          this.favoriteIds.set(next);
        }),
        catchError(() => {
          this.toastService.show('No tienes sesión iniciada', 'error');
          return of({ gameId, isFavorite: false });
        }),
      );
  }

  isFavorite(gameId: string) {
    return this.favoriteIds().has(gameId);
  }

  ensureLoaded() {
    return this.list().pipe(map(() => true));
  }
}
