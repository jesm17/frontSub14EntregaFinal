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
        <h1 class="auth-title">Registrarse</h1>
        @if (formError(); as err) {
          <div class="form-banner form-banner--error" role="alert">{{ err }}</div>
        }
        <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
          <div class="auth-field">
            <label class="sr-only" for="signup-name">Nombre</label>
            <input
              id="signup-name"
              class="auth-input"
              [class.auth-input--invalid]="showErr('name')"
              formControlName="name"
              placeholder="Nombre"
              autocomplete="name"
              [attr.aria-invalid]="showErr('name')"
              [attr.aria-describedby]="showErr('name') ? 'err-signup-name' : null"
            />
            @if (showErr('name')) {
              <p id="err-signup-name" class="auth-field-msg auth-field-msg--error">{{ errMsg('name') }}</p>
            }
          </div>
          <div class="auth-field">
            <label class="sr-only" for="signup-email">Correo</label>
            <input
              id="signup-email"
              class="auth-input"
              [class.auth-input--invalid]="showErr('email')"
              formControlName="email"
              type="email"
              placeholder="Correo"
              autocomplete="email"
              [attr.aria-invalid]="showErr('email')"
              [attr.aria-describedby]="showErr('email') ? 'err-signup-email' : null"
            />
            @if (showErr('email')) {
              <p id="err-signup-email" class="auth-field-msg auth-field-msg--error">{{ errMsg('email') }}</p>
            }
          </div>
          <div class="auth-field">
            <label class="sr-only" for="signup-password">Contrasena</label>
            <input
              id="signup-password"
              class="auth-input"
              [class.auth-input--invalid]="showErr('password')"
              formControlName="password"
              type="password"
              placeholder="Contrasena"
              autocomplete="new-password"
              [attr.aria-invalid]="showErr('password')"
              [attr.aria-describedby]="showErr('password') ? 'err-signup-password' : null"
            />
            @if (showErr('password')) {
              <p id="err-signup-password" class="auth-field-msg auth-field-msg--error">{{ errMsg('password') }}</p>
            }
          </div>
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

  readonly submitted = signal(false);
  readonly formError = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(72)]],
  });

  submit() {
    this.submitted.set(true);
    this.formError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.auth.signup(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/catalog'),
      error: (err) => this.formError.set(parseHttpError(err)),
    });
  }

  showErr(control: 'name' | 'email' | 'password'): boolean {
    return showFieldError(this.form.get(control), this.submitted());
  }

  errMsg(control: 'name' | 'email' | 'password'): string | null {
    return fieldErrorMessage(this.form.get(control), this.submitted());
  }
}
