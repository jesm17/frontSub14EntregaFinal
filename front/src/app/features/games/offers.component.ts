import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GamesService } from '../../core/services/games.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FavoritesService } from '../../core/services/favorites.service';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { startWith, Subject, switchMap } from 'rxjs';

@Component({
  imports: [RouterLink, CurrencyPipe],
  template: `
    <h1 class="games-page-heading">Ofertas</h1>
    @if (games(); as list) {
      <section class="games-page-grid">
        @for (game of list; track game._id) {
          <article class="game-card game-card--slider game-card--catalog">
            <div class="game-card-header">
              <a [routerLink]="['/detail', game._id]" class="game-card-image-link">
                <img [src]="game.image" [alt]="game.name" />
              </a>
              <button class="game-card-favorite" type="button" aria-label="Favorito" (click)="toggleFavorite(game._id)">
                <i class="fas fa-bookmark" [class.active]="isFavorite(game._id)"></i>
              </button>
            </div>
            <div class="game-card-content">
              <h3><a class="game-card-title-link" [routerLink]="['/detail', game._id]">{{ game.name }}</a></h3>
              <span class="platforms">{{ game.platforms.join(', ') }}</span>
            </div>
            <div class="game-card-footer">
              <strong>{{ (game.price | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO')?.replace(' ', ' ') }}</strong>
              <button class="btn-add-cart" type="button" aria-label="Agregar al carrito" (click)="addToCart(game._id)">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </article>
        }
      </section>
      <div class="pagination-controls">
        <button type="button" (click)="prevPage()" [disabled]="currentPage() === 1"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
        <span>Página {{ currentPage() }} de {{ totalPages() }}</span>
        <button type="button" (click)="nextPage()" [disabled]="currentPage() >= totalPages()"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
      </div>
    } @else {
      <div class="loading-state">Cargando ofertas...</div>
    }
  `,
})
export class OffersComponent {
  private readonly gamesService = inject(GamesService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly cartService = inject(CartService);
  private readonly reload$ = new Subject<void>();
  readonly pageSize = 12;
  currentPage = signal(1);
  gamesResponse = toSignal(
    this.reload$.pipe(
      startWith(void 0),
      switchMap(() => this.gamesService.offersPaginated(this.currentPage(), this.pageSize)),
    ),
  );
  games = computed(() => this.gamesResponse()?.items);
  totalPages = computed(() => this.gamesResponse()?.totalPages ?? 1);
  _favoritesLoaded = toSignal(this.favoritesService.ensureLoaded(), { initialValue: false });

  isFavorite(gameId: string) {
    return this.favoritesService.isFavorite(gameId);
  }

  toggleFavorite(gameId: string) {
    this.favoritesService.toggle(gameId).subscribe();
  }

  addToCart(gameId: string) {
    this.cartService.addGame(gameId).subscribe();
  }

  nextPage() {
    if (this.currentPage() >= this.totalPages()) return;
    this.currentPage.update((value) => value + 1);
    this.reload$.next();
  }

  prevPage() {
    if (this.currentPage() <= 1) return;
    this.currentPage.update((value) => value - 1);
    this.reload$.next();
  }
}
