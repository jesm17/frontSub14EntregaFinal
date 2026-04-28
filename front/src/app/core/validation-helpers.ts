import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

export interface FieldErrorHints {
  pattern?: string;
}

export function showFieldError(ctrl: AbstractControl | null | undefined, submitted: boolean): boolean {
  if (!ctrl) return false;
  return ctrl.invalid && (ctrl.touched || ctrl.dirty || submitted);
}

export function fieldErrorMessage(
  ctrl: AbstractControl | null | undefined,
  submitted: boolean,
  hints?: FieldErrorHints,
): string | null {
  if (!showFieldError(ctrl, submitted) || !ctrl) return null;
  const err = ctrl.errors;
  if (!err) return null;
  if (err['required']) return 'Este campo es obligatorio.';
  if (err['email']) return 'Introduce un correo electrónico válido.';
  const ml = err['minlength'] as { requiredLength: number } | undefined;
  if (ml?.requiredLength != null) return `Mínimo ${ml.requiredLength} caracteres.`;
  const max = err['maxlength'] as { requiredLength: number } | undefined;
  if (max?.requiredLength != null) return `Máximo ${max.requiredLength} caracteres.`;
  if (err['pattern']) return hints?.pattern ?? 'Formato no válido.';
  if (err['phoneInvalid']) return 'Introduce un teléfono válido (9 a 15 dígitos).';
  return null;
}

/** Obligatorio debe ir aparte; cuando hay texto, comprueba dígitos. */
export function phoneDigitsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = (control.value ?? '').toString().trim();
    if (!raw) return null;
    const digits = raw.replace(/\D/g, '');
    if (!digits.length) return { phoneInvalid: true };
    if (digits.length < 9 || digits.length > 15) return { phoneInvalid: true };
    return null;
  };
}

function extractMessageBody(body: unknown): string | null {
  if (typeof body === 'string' && body.trim()) return body;
  if (!body || typeof body !== 'object') return null;
  const o = body as Record<string, unknown>;
  const m = o['message'];
  if (typeof m === 'string' && m.length) return m;
  if (Array.isArray(m) && m.length && typeof m[0] === 'string') return m[0];
  if (Array.isArray(o['messages']) && o['messages'].length && typeof o['messages'][0] === 'string')
    return o['messages'][0];
  const errArr = o['errors'];
  if (Array.isArray(errArr) && typeof errArr[0] === 'string') return errArr[0];
  return null;
}

export function parseHttpError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const msg = extractMessageBody(error.error);
    if (msg) return msg;
    switch (error.status) {
      case 400:
        return 'Los datos enviados no son válidos.';
      case 401:
        return 'Correo o contraseña incorrectos.';
      case 403:
        return 'No tienes permiso para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 409:
        return 'El correo electrónico ya está registrado.';
      case 422:
        return 'Revisa los datos e inténtalo de nuevo.';
      case 500:
      case 502:
      case 503:
        return 'Error en el servidor. Inténtalo más tarde.';
      case 0:
        return 'No hay conexión. Comprueba tu red.';
      default:
        return 'Ha ocurrido un error al contactar el servidor.';
    }
  }
  return 'Ha ocurrido un error. Inténtalo de nuevo.';
}
