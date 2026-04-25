import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api';
import { Subject, catchError, map, of, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

export interface CartLine {
  gameId: string;
  quantity: number;
}

export interface Cart {
  lines: CartLine[];
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly refreshCart$ = new Subject<void>();

  readonly cart$ = this.refreshCart$.pipe(
    startWith(void 0),
    switchMap(() => this.getMe().pipe(catchError(() => of({ lines: [] } as Cart)))),
    shareReplay(1),
  );

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
  ) {}

  getMe() {
    return this.http.get<Cart>(`${API_URL}/cart/me`);
  }

  updateMe(lines: CartLine[]) {
    return this.http.put(`${API_URL}/cart/me`, { lines });
  }

  refresh() {
    this.refreshCart$.next();
  }

  addGame(gameId: string) {
    if (!this.authService.currentUser()) {
      this.toastService.show('No tienes sesión iniciada', 'error');
      return of(null);
    }

    return this.getMe().pipe(
      map((cart) => {
        const existing = cart.lines.find((line) => line.gameId === gameId);
        if (existing) {
          return cart.lines.map((line) =>
            line.gameId === gameId ? { ...line, quantity: line.quantity + 1 } : line,
          );
        }
        return [...cart.lines, { gameId, quantity: 1 }];
      }),
      switchMap((lines) => this.updateMe(lines)),
      tap(() => this.refresh()),
      catchError(() => {
        this.toastService.show('No tienes sesión iniciada', 'error');
        return of(null);
      }),
    );
  }

  removeGame(gameId: string) {
    return this.getMe().pipe(
      map((cart) => cart.lines.filter((line) => line.gameId !== gameId)),
      switchMap((lines) => this.updateMe(lines)),
      tap(() => this.refresh()),
    );
  }
}
