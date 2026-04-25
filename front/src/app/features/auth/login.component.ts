import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-container">
        <h1 class="auth-title">Iniciar sesion</h1>
        <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
          <input class="auth-input" formControlName="email" type="email" placeholder="Correo" />
          <input class="auth-input" formControlName="password" type="password" placeholder="Contrasena" />
          <button class="auth-btn" type="submit">Entrar</button>
          <p class="auth-link">No tienes cuenta? <a routerLink="/signup">Registrate</a></p>
        </form>
      </div>
    </section>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  form = this.fb.group({ email: ['', [Validators.required]], password: ['', [Validators.required]] });

  submit() {
    if (this.form.invalid) return;
    this.auth.login(this.form.getRawValue() as { email: string; password: string }).subscribe(() => {
      this.router.navigateByUrl('/catalog');
    });
  }
}
