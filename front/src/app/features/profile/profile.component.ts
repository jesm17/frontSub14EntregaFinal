import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UsersService } from '../../core/services/users.service';

@Component({
  template: `
    @if (user(); as u) {
      <section class="profile-page">
        <article class="profile-sheet">
          <header class="profile-head">
            <div class="profile-avatar" aria-hidden="true">{{ initials(u.name) }}</div>
            <div>
              <p class="profile-kicker">Tu cuenta</p>
              <h1 class="profile-heading">Perfil</h1>
            </div>
          </header>

          <div class="profile-rows">
            <div class="profile-row">
              <span class="profile-row_label">
                <i class="fas fa-user"></i>
                Nombre
              </span>
              <span class="profile-row_value">{{ u.name }}</span>
            </div>
            <div class="profile-row">
              <span class="profile-row_label">
                <i class="fas fa-envelope"></i>
                Email
              </span>
              <span class="profile-row_value">{{ u.email }}</span>
            </div>
            <div class="profile-row">
              <span class="profile-row_label">
                <i class="fas fa-id-badge"></i>
                Rol
              </span>
              <span class="profile-row_value">
                <span class="profile-badge" [class.profile-badge--user]="u.role === 'user'" [class.profile-badge--admin]="u.role === 'admin'">
                  {{ roleLabel(u.role) }}
                </span>
              </span>
            </div>
          </div>
        </article>
      </section>
    }
  `,
})
export class ProfileComponent {
  private readonly usersService = inject(UsersService);
  user = toSignal(this.usersService.me());

  initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  roleLabel(role: 'user' | 'admin'): string {
    return role === 'admin' ? 'Administrador' : 'Usuario';
  }
}
