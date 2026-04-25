import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GamesService } from '../../core/services/games.service';
import { switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { FavoritesService } from '../../core/services/favorites.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  imports: [RouterLink],
  template: `
    @if (game(); as g) {
      <article class="detail-hero">
        <div class="detail-hero__media"><img class="detail-hero__img" [src]="g.image" [alt]="g.name" /></div>
        <div class="detail-hero__body">
          <div class="detail-hero__top">
            <button class="detail-favorite" type="button" aria-label="Agregar a favoritos" (click)="toggleFavorite(g._id)">
              <span class="detail-favorite__label">Agregar a favoritos</span>
              <i class="fas fa-bookmark" [class.active]="isFavorite(g._id)"></i>
            </button>
          </div>
          <h1 class="detail-title">{{ g.name }}</h1>
          <p class="detail-desc">{{ g.description }}</p>
          <div class="detail-buy">
            <div class="detail-price">$ {{ formatPrice(g.price) }}</div>
            <button
              class="btn-add-cart btn-add-cart--large"
              type="button"
              aria-label="Agregar al carrito"
              (click)="addToCart(g._id)"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </article>

      <section class="detail-related">
        <h2 class="detail-related__title">Juegos relacionados</h2>
        <div class="detail-related__grid">
          @for (item of relatedGames(); track item._id) {
            <article class="game-card game-card--slider game-card--catalog game-card--related">
              <div class="game-card-header">
                <a [routerLink]="['/detail', item._id]" class="game-card-image-link">
                  <img [src]="item.image" [alt]="item.name" />
                </a>
                <button class="game-card-favorite" type="button" aria-label="Favorito" (click)="toggleFavorite(item._id)">
                  <i class="fas fa-bookmark" [class.active]="isFavorite(item._id)"></i>
                </button>
              </div>
              <div class="game-card-content">
                <h3><a class="game-card-title-link" [routerLink]="['/detail', item._id]">{{ item.name }}</a></h3>
                <span class="platforms">{{ item.platforms.join(', ') }}</span>
              </div>
              <div class="game-card-footer">
                <strong>$ {{ formatPrice(item.price) }}</strong>
                <button class="btn-add-cart" type="button" aria-label="Agregar al carrito" (click)="addToCart(item._id)">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </article>
          }
        </div>
      </section>
    } @else {
      <div class="loading-state">Cargando detalle del juego...</div>
    }
  `,
})
export class DetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly gamesService = inject(GamesService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly cartService = inject(CartService);
  game = toSignal(
    this.route.paramMap.pipe(switchMap((params) => this.gamesService.byId(params.get('id') ?? ''))),
  );
  games = toSignal(this.gamesService.all(), { initialValue: [] });
  _favoritesLoaded = toSignal(this.favoritesService.ensureLoaded(), { initialValue: false });
  relatedGames = computed(() => {
    const current = this.game();
    if (!current) return [];
    return this.games()
      .filter((item) => item._id !== current._id)
      .slice(0, 4);
  });

  formatPrice(value: number) {
    return Math.round(value).toLocaleString('es-CO');
  }

  isFavorite(gameId: string) {
    return this.favoritesService.isFavorite(gameId);
  }

  toggleFavorite(gameId: string) {
    this.favoritesService.toggle(gameId).subscribe();
  }

  addToCart(gameId: string) {
    this.cartService.addGame(gameId).subscribe();
  }
}
