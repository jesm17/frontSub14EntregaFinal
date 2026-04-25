import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';

@Component({
  imports: [ReactiveFormsModule],
  template: `
    <section class="contact-page">
      <div class="contact-container">
        <div class="contact-info"><h2>Contacto</h2></div>
        <form class="contact-form" [formGroup]="form" (ngSubmit)="submit()">
          <input class="contact-input" formControlName="name" placeholder="Nombre" />
          <input class="contact-input" formControlName="email" placeholder="Email" />
          <textarea class="contact-textarea" formControlName="message" placeholder="Mensaje"></textarea>
          <button class="contact-btn" type="submit">Enviar</button>
        </form>
      </div>
    </section>
  `,
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    message: ['', [Validators.required]],
  });

  submit() {
    if (this.form.invalid) return;
    this.contactService.send(this.form.getRawValue() as any).subscribe();
  }
}
