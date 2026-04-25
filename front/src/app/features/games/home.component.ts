import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { GamesService } from '../../core/services/games.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';

@Component({
  imports: [RouterLink, CurrencyPipe],
  template: `
    @if (offers(); as offersList) {
      @if (outstanding(); as outstandingList) {
        <section class="home-section">
          <h1 class="section-title">OFERTAS</h1>
          <div class="game-slider">
            <button type="button" class="game-slider_btn game-slider_btn--prev" (click)="scrollTrack(offersTrack, -1)">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="game-slider_viewport">
              <div class="game-slider_track" #offersTrack>
                @for (game of offersList; track game._id) {
                  <article class="game-card game-card--slider">
                    <div class="game-card-header">
                      <a [routerLink]="['/detail', game._id]" class="game-card-image-link">
                        <img [src]="game.image" [alt]="game.name" />
                      </a>
                      <button class="game-card-favorite" type="button" aria-label="Favorito" (click)="toggleFavorite(game._id)">
                        <i class="fas fa-bookmark" [class.active]="isFavorite(game._id)"></i>
                      </button>
                    </div>
                    <div class="game-card-content">
                      <h3>
                        <a class="game-card-title-link" [routerLink]="['/detail', game._id]">{{ game.name }}</a>
                      </h3>
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
              </div>
            </div>
            <button type="button" class="game-slider_btn game-slider_btn--next" (click)="scrollTrack(offersTrack, 1)">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </section>

        <section class="home-section">
          <h2 class="section-title">JUEGOS DESTACADOS</h2>
          <div class="game-slider">
            <button type="button" class="game-slider_btn game-slider_btn--prev" (click)="scrollTrack(outstandingTrack, -1)">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="game-slider_viewport">
              <div class="game-slider_track" #outstandingTrack>
                @for (game of outstandingList; track game._id) {
                  <article class="game-card game-card--slider">
                    <div class="game-card-header">
                      <a [routerLink]="['/detail', game._id]" class="game-card-image-link">
                        <img [src]="game.image" [alt]="game.name" />
                      </a>
                      <button class="game-card-favorite" type="button" aria-label="Favorito" (click)="toggleFavorite(game._id)">
                        <i class="fas fa-bookmark" [class.active]="isFavorite(game._id)"></i>
                      </button>
                    </div>
                    <div class="game-card-content">
                      <h3>
                        <a class="game-card-title-link" [routerLink]="['/detail', game._id]">{{ game.name }}</a>
                      </h3>
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
              </div>
            </div>
            <button type="button" class="game-slider_btn game-slider_btn--next" (click)="scrollTrack(outstandingTrack, 1)">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </section>
      } @else {
        <div class="loading-state">Cargando juegos destacados...</div>
      }
    } @else {
      <div class="loading-state">Cargando ofertas...</div>
    }
  `,
})
export class HomeComponent {
  private readonly gamesService = inject(GamesService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly cartService = inject(CartService);
  offers = toSignal(this.gamesService.offers());
  outstanding = toSignal(this.gamesService.outstanding());
  _favoritesLoaded = toSignal(this.favoritesService.ensureLoaded(), { initialValue: false });

  scrollTrack(track: HTMLElement, direction: 1 | -1) {
    track.scrollBy({ left: direction * 300, behavior: 'smooth' });
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
