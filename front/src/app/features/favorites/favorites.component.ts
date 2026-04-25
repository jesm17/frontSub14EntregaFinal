import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FavoritesService } from '../../core/services/favorites.service';
import { GamesService } from '../../core/services/games.service';
import { map, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [RouterLink, CurrencyPipe],
  template: `
    <h1 class="favorites-page-title">Mis Favoritos</h1>
    @if (games(); as list) {
      <section class="games-page-grid">
        @for (game of list; track game._id) {
          <article class="game-card game-card--slider game-card--catalog">
            <div class="game-card-header">
              <a [routerLink]="['/detail', game._id]" class="game-card-image-link">
                <img [src]="game.image" [alt]="game.name" />
              </a>
              <button class="game-card-favorite" type="button" aria-label="Favorito" (click)="toggleFavorite(game._id)">
                <i class="fas fa-bookmark active"></i>
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
    } @else {
      <div class="loading-state">Cargando favoritos...</div>
    }
  `,
})
export class FavoritesComponent {
  private readonly favoritesService = inject(FavoritesService);
  private readonly gamesService = inject(GamesService);
  private readonly cartService = inject(CartService);
  games = toSignal(
    this.favoritesService
      .list()
      .pipe(
        switchMap((fav) => this.gamesService.all().pipe(map((games) => games.filter((g) => fav.some((f) => f.gameId === g._id))))),
      ),
  );

  toggleFavorite(gameId: string) {
    this.favoritesService.toggle(gameId).subscribe();
  }

  addToCart(gameId: string) {
    this.cartService.addGame(gameId).subscribe();
  }
}
