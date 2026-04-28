import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';
import { fieldErrorMessage, parseHttpError, phoneDigitsValidator, showFieldError } from '../../core/validation-helpers';

@Component({
  imports: [ReactiveFormsModule],
  template: `
    <section class="contact-page">
      <div class="contact-layout">
        <aside class="contact-aside">
          <h1 class="contact-aside_title">Contactános</h1>
          <ul class="contact-aside_list">
            <li>
              <i class="fas fa-phone" aria-hidden="true"></i>
              <span>xxxxxxxxxx</span>
            </li>
            <li>
              <i class="fas fa-envelope" aria-hidden="true"></i>
              <span>xxxxxxxxxx</span>
            </li>
          </ul>
        </aside>

        <form class="contact-form-panel" [formGroup]="form" (ngSubmit)="submit()">
          @if (serverError(); as errMsg) {
            <div class="form-banner form-banner--error" role="alert">{{ errMsg }}</div>
          }
          <div class="contact-field">
            <label class="contact-label" for="contact-name">Nombre</label>
            <input
              id="contact-name"
              type="text"
              class="contact-field-input"
              [class.contact-field-input--invalid]="showErr('name')"
              formControlName="name"
              placeholder="Pepito Perez"
              autocomplete="name"
              [attr.aria-invalid]="showErr('name')"
              [attr.aria-describedby]="showErr('name') ? 'err-contact-name' : null"
            />
            @if (showErr('name')) {
              <p id="err-contact-name" class="contact-field-msg contact-field-msg--error">{{ errMsg('name') }}</p>
            }
          </div>
          <div class="contact-field">
            <label class="contact-label" for="contact-email">Email</label>
            <input
              id="contact-email"
              type="email"
              class="contact-field-input"
              [class.contact-field-input--invalid]="showErr('email')"
              formControlName="email"
              placeholder="pepito@perez.com"
              autocomplete="email"
              [attr.aria-invalid]="showErr('email')"
              [attr.aria-describedby]="showErr('email') ? 'err-contact-email' : null"
            />
            @if (showErr('email')) {
              <p id="err-contact-email" class="contact-field-msg contact-field-msg--error">{{ errMsg('email') }}</p>
            }
          </div>
          <div class="contact-field">
            <label class="contact-label" for="contact-phone">Teléfono</label>
            <input
              id="contact-phone"
              type="tel"
              class="contact-field-input"
              [class.contact-field-input--invalid]="showErr('phone')"
              formControlName="phone"
              placeholder="1234567890"
              autocomplete="tel"
              [attr.aria-invalid]="showErr('phone')"
              [attr.aria-describedby]="showErr('phone') ? 'err-contact-phone' : null"
            />
            @if (showErr('phone')) {
              <p id="err-contact-phone" class="contact-field-msg contact-field-msg--error">{{ errMsg('phone') }}</p>
            }
          </div>
          <div class="contact-field">
            <label class="contact-label" for="contact-message">Mensaje</label>
            <textarea
              id="contact-message"
              class="contact-field-textarea"
              [class.contact-field-textarea--invalid]="showErr('message')"
              formControlName="message"
              rows="6"
              [attr.aria-invalid]="showErr('message')"
              [attr.aria-describedby]="showErr('message') ? 'err-contact-message' : null"
            ></textarea>
            @if (showErr('message')) {
              <p id="err-contact-message" class="contact-field-msg contact-field-msg--error">{{ errMsg('message') }}</p>
            }
          </div>
          <div class="contact-form-actions">
            <button class="contact-submit-btn" type="submit">
              Enviar
              <i class="fas fa-paper-plane" aria-hidden="true"></i>
            </button>
            @if (received()) {
              <p class="contact-success-msg">Hemos recibido tu mensaje.</p>
            }
          </div>
        </form>
      </div>
    </section>
  `,
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  readonly received = signal(false);
  readonly submitted = signal(false);
  readonly serverError = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    phone: ['', [Validators.required, phoneDigitsValidator()]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(4000)]],
  });

  submit() {
    this.submitted.set(true);
    this.serverError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email, message } = this.form.getRawValue();
    this.contactService.send({ name, email, message }).subscribe({
      next: () => {
        this.received.set(true);
        this.submitted.set(false);
        this.form.reset();
      },
      error: (err) => this.serverError.set(parseHttpError(err)),
    });
  }

  showErr(control: 'name' | 'email' | 'phone' | 'message'): boolean {
    return showFieldError(this.form.get(control), this.submitted());
  }

  errMsg(control: 'name' | 'email' | 'phone' | 'message'): string | null {
    return fieldErrorMessage(this.form.get(control), this.submitted());
  }
}
