import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UsersService } from '../../core/services/users.service';

@Component({
  template: `
    @if (user(); as u) {
      <section class="profile-page">
        <div class="auth-container profile-card">
          <h1 class="auth-title profile-card__title">Perfil</h1>
          <dl class="profile-fields">
            <div class="profile-field"><dt>Nombre</dt><dd>{{ u.name }}</dd></div>
            <div class="profile-field"><dt>Email</dt><dd>{{ u.email }}</dd></div>
            <div class="profile-field"><dt>Rol</dt><dd>{{ u.role }}</dd></div>
          </dl>
        </div>
      </section>
    }
  `,
})
export class ProfileComponent {
  private readonly usersService = inject(UsersService);
  user = toSignal(this.usersService.me());
}
