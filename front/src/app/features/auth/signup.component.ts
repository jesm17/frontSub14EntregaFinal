import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-container">
        <h1 class="auth-title">Registrarse</h1>
        <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
          <input class="auth-input" formControlName="name" placeholder="Nombre" />
          <input class="auth-input" formControlName="email" type="email" placeholder="Correo" />
          <input class="auth-input" formControlName="password" type="password" placeholder="Contrasena" />
          <button class="auth-btn" type="submit">Crear cuenta</button>
          <p class="auth-link">Ya tienes cuenta? <a routerLink="/login">Entrar</a></p>
        </form>
      </div>
    </section>
  `,
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  submit() {
    if (this.form.invalid) return;
    this.auth
      .signup(this.form.getRawValue() as { name: string; email: string; password: string })
      .subscribe(() => this.router.navigateByUrl('/catalog'));
  }
}
