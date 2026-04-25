import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'error' | 'success';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastMessage[]>([]);
  private nextId = 1;

  show(message: string, type: ToastMessage['type'] = 'error', durationMs = 3000) {
    const id = this.nextId++;
    this.toasts.update((current) => [...current, { id, message, type }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }

  dismiss(id: number) {
    this.toasts.update((current) => current.filter((toast) => toast.id !== id));
  }
}
