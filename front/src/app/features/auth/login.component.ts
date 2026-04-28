import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { fieldErrorMessage, parseHttpError, showFieldError } from '../../core/validation-helpers';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-container">
        <h1 class="auth-title">Iniciar sesion</h1>
        @if (formError(); as err) {
          <div class="form-banner form-banner--error" role="alert">{{ err }}</div>
        }
        <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
          <div class="auth-field">
            <label class="sr-only" for="login-email">Correo</label>
            <input
              id="login-email"
              class="auth-input"
              [class.auth-input--invalid]="showErr('email')"
              formControlName="email"
              type="email"
              placeholder="Correo"
              autocomplete="email"
              [attr.aria-invalid]="showErr('email')"
              [attr.aria-describedby]="showErr('email') ? 'err-login-email' : null"
            />
            @if (showErr('email')) {
              <p id="err-login-email" class="auth-field-msg auth-field-msg--error">{{ errMsg('email') }}</p>
            }
          </div>
          <div class="auth-field">
            <label class="sr-only" for="login-password">Contrasena</label>
            <input
              id="login-password"
              class="auth-input"
              [class.auth-input--invalid]="showErr('password')"
              formControlName="password"
              type="password"
              placeholder="Contrasena"
              autocomplete="current-password"
              [attr.aria-invalid]="showErr('password')"
              [attr.aria-describedby]="showErr('password') ? 'err-login-password' : null"
            />
            @if (showErr('password')) {
              <p id="err-login-password" class="auth-field-msg auth-field-msg--error">{{ errMsg('password') }}</p>
            }
          </div>
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

  readonly submitted = signal(false);
  readonly formError = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    this.submitted.set(true);
    this.formError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/catalog'),
      error: (err) => this.formError.set(parseHttpError(err)),
    });
  }

  showErr(control: 'email' | 'password'): boolean {
    return showFieldError(this.form.get(control), this.submitted());
  }

  errMsg(control: 'email' | 'password'): string | null {
    return fieldErrorMessage(this.form.get(control), this.submitted());
  }
}
