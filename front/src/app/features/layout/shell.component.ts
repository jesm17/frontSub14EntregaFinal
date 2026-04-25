import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="site-header">
      <div class="site-header_inner">
        <div class="site-header_top">
          <a class="site-header_brand" routerLink="/">
            <span class="site-header_logo-text"><img src="/img/logo.png" width="70" alt="Gaming Store"></span>
          </a>
          <div class="site-header_actions">
            <a routerLink="/profile" aria-label="Perfil"><i class="fas fa-user"></i></a>
            <a routerLink="/cart" aria-label="Carrito" class="site-header_cart">
              <i class="fas fa-shopping-cart"></i>
              @if (cartItemsCount() > 0) {
                <span class="cart-badge">{{ cartItemsCount() }}</span>
              }
            </a>
            @if (user()) {
              <a href="#" (click)="logout($event)"><i class="fas fa-sign-out-alt"></i></a>
            } @else {
              <a routerLink="/login"><i class="fas fa-sign-in-alt"></i></a>
            }
          </div>
        </div>
        <nav class="site-nav">
          <div class="site-nav_list">
            <a routerLink="/">Menu principal</a>
            <a routerLink="/offer">Descuentos</a>
            <a routerLink="/catalog">Ver catalogo</a>
            <a routerLink="/favorites">Mis favoritos</a>
            @if (isAdmin()) {
              <a routerLink="/admin">Admin</a>
            }
          </div>
        </nav>
      </div>
    </header>
    <div class="toast-container">
      @for (toast of toasts(); track toast.id) {
        <div class="toast toast--{{ toast.type }}">
          <span>{{ toast.message }}</span>
          <button type="button" aria-label="Cerrar" (click)="dismissToast(toast.id)"><i class="fas fa-times"></i></button>
        </div>
      }
    </div>
    <main class="main"><router-outlet /></main>
    <footer class="site-footer">
      <div class="site-footer_inner">
        <div class="site-footer_block"><h2>Gaming Store</h2></div>
      </div>
    </footer>
  `,
})
export class ShellComponent {
  private readonly auth = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);
  user = this.auth.currentUser;
  isAdmin = computed(() => this.auth.isAdmin());
  cart = toSignal(this.cartService.cart$, { initialValue: { lines: [] } });
  cartItemsCount = computed(() => this.cart().lines.reduce((total, line) => total + line.quantity, 0));
  toasts = this.toastService.toasts;

  private readonly syncCartWithSession = effect(() => {
    this.user();
    this.cartService.refresh();
  });

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
  }

  dismissToast(id: number) {
    this.toastService.dismiss(id);
  }
}
