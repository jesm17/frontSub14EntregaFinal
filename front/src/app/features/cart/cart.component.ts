import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '../../core/services/cart.service';
import { GamesService } from '../../core/services/games.service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Game } from '../../core/models';

interface CartItemView {
  game: Game;
  quantity: number;
  total: number;
}

@Component({
  imports: [CurrencyPipe, RouterLink],
  template: `
    <h1 class="cart-page-heading">Tu Carrito</h1>
    @if (!isLoading()) {
      @if (items().length) {
        <section class="cart-layout">
          <div class="cart-list">
            @for (item of items(); track item.game._id) {
              <article class="cart-item">
                <a class="cart-item_media" [routerLink]="['/detail', item.game._id]">
                  <img [src]="item.game.image" [alt]="item.game.name" />
                </a>
                <div class="cart-item_body">
                  <h2 class="cart-item_title">
                    <a [routerLink]="['/detail', item.game._id]">{{ item.game.name }}</a>
                  </h2>
                  <p class="cart-item_platforms">{{ item.game.platforms.join(', ') }}</p>
                </div>
                <div class="cart-item_actions">
                  <strong class="cart-item_price">{{ (item.total | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO')?.replace(' ', ' ') }}</strong>
                  <button type="button" class="cart-item_remove" aria-label="Eliminar del carrito" (click)="remove(item.game._id)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </article>
            }
          </div>

          <aside class="cart-summary">
            <h2 class="cart-summary_title">Resumen de orden</h2>
            <div class="cart-summary_row">
              <span>Subtotal</span>
              <strong>{{ (subtotal() | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO')?.replace(' ', ' ') }}</strong>
            </div>
            <div class="cart-summary_row cart-summary_row--total">
              <span>Total</span>
              <strong>{{ (subtotal() | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO')?.replace(' ', ' ') }}</strong>
            </div>
            <button type="button" class="cart-summary_btn">Proceder al pago</button>
          </aside>
        </section>
      } @else {
        <div class="cart-empty"><h2 class="cart-empty_title">Tu carrito esta vacio</h2></div>
      }
    } @else {
      <div class="loading-state">Cargando carrito...</div>
    }
  `,
})
export class CartComponent {
  private readonly cartService = inject(CartService);
  private readonly gamesService = inject(GamesService);

  cart = toSignal(this.cartService.cart$);
  games = toSignal(this.gamesService.all());
  isLoading = computed(() => !this.cart() || !this.games());
  items = computed<CartItemView[]>(() => {
    const currentCart = this.cart();
    const currentGames = this.games();
    if (!currentCart || !currentGames) return [];
    const gameMap = new Map(currentGames.map((game) => [game._id, game]));
    return currentCart.lines
      .map((line) => {
        const game = gameMap.get(line.gameId);
        if (!game) return null;
        return {
          game,
          quantity: line.quantity,
          total: game.price * line.quantity,
        };
      })
      .filter((item): item is CartItemView => item !== null);
  });
  subtotal = computed(() => this.items().reduce((sum, item) => sum + item.total, 0));

  remove(gameId: string) {
    this.cartService.removeGame(gameId).subscribe();
  }
}
