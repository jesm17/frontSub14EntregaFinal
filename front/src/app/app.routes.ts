import { Routes } from '@angular/router';
import { ShellComponent } from './features/layout/shell.component';
import { CatalogComponent } from './features/games/catalog.component';
import { OffersComponent } from './features/games/offers.component';
import { DetailComponent } from './features/games/detail.component';
import { HomeComponent } from './features/games/home.component';
import { FavoritesComponent } from './features/favorites/favorites.component';
import { CartComponent } from './features/cart/cart.component';
import { ContactComponent } from './features/contact/contact.component';
import { ProfileComponent } from './features/profile/profile.component';
import { LoginComponent } from './features/auth/login.component';
import { SignupComponent } from './features/auth/signup.component';
import { AdminComponent } from './features/admin/admin.component';
import { adminGuard, authGuard } from './core/guards';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', component: HomeComponent },
      { path: 'catalog', component: CatalogComponent },
      { path: 'offer', component: OffersComponent },
      { path: 'detail/:id', component: DetailComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },
      { path: 'cart', component: CartComponent, canActivate: [authGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
      { path: 'admin', component: AdminComponent, canActivate: [authGuard, adminGuard] },
    ],
  },
];
