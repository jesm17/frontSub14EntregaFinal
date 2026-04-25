import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GamesService } from '../../core/services/games.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Game } from '../../core/models';
import { startWith, Subject, switchMap } from 'rxjs';

@Component({
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `
    <section class="admin-page">
      <h1 class="games-page-heading">Panel Admin</h1>

      @if (!showForm()) {
        <div class="admin-toolbar">
          <button type="button" class="admin-add-btn" (click)="startCreate()">Agregar juego +</button>
        </div>
      }

      @if (!showForm()) {
        @if (isLoading()) {
          <div class="loading-state">Cargando juegos...</div>
        } @else {
          <div class="admin-table-container">
            <table class="admin-table admin-games-table">
              <thead>
                <tr>
                  <th>NOMBRE</th>
                  <th>PLATAFORMA</th>
                  <th>PRECIO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                @for (game of games(); track game._id) {
                  <tr>
                    <td>{{ game.name }}</td>
                    <td>{{ game.platforms.join(', ') || 'Sin plataformas' }}</td>
                    <td>{{ (game.price | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO')?.replace(' ', ' ') }}</td>
                    <td class="admin-actions">
                      <button type="button" class="admin-action-btn admin-action-btn--edit" (click)="startEdit(game)">
                        <i class="fas fa-pen"></i>
                      </button>
                      <button type="button" class="admin-action-btn admin-action-btn--delete" (click)="remove(game._id)">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        <div class="pagination-controls">
          <button type="button" (click)="prevPage()" [disabled]="currentPage() === 1"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
          <span>Página {{ currentPage() }} de {{ totalPages() }}</span>
          <button type="button" (click)="nextPage()" [disabled]="currentPage() >= totalPages()"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
        </div>
        }
      }

      @if (showForm()) {
        <form class="admin-game-form" [formGroup]="form" (ngSubmit)="save()">
          <div class="admin-game-form__grid">
            <div class="admin-game-form__image-panel">
              <div class="admin-game-form__preview">
                @if (form.controls.image.value) {
                  <img [src]="form.controls.image.value || ''" alt="Vista previa del juego" />
                } @else {
                  <div class="admin-game-form__preview-placeholder">
                    <i class="far fa-image"></i>
                    <span>Agregar imagen de presentación</span>
                  </div>
                }
              </div>
              <input class="auth-input" formControlName="image" placeholder="URL de la imagen" />
            </div>

            <div class="admin-game-form__fields">
              <input class="auth-input" formControlName="name" placeholder="Titulo del Juego" />
              <textarea class="contact-textarea" formControlName="description" placeholder="Describa el juego"></textarea>
              <input class="auth-input" formControlName="price" placeholder="Agregar precio" type="number" min="0" step="1" />
            </div>
          </div>

          <input
            class="auth-input"
            formControlName="platforms"
            placeholder="Agregar etiquetas tipo de juego (ejemplo: Retro, Aventura, PC, PS5)"
          />

          <input class="auth-input" formControlName="slug" placeholder="Slug del juego (opcional)" />

          <div class="admin-game-form__actions">
            <button class="auth-btn admin-game-form__save" type="submit">{{ editingId() ? 'GUARDAR CAMBIOS' : 'GUARDAR' }}</button>
            <button class="admin-game-form__cancel" type="button" (click)="cancelForm()">CANCELAR</button>
          </div>
        </form>
      }
    </section>
  `,
})
export class AdminComponent {
  private readonly gamesService = inject(GamesService);
  private readonly fb = inject(FormBuilder);
  private readonly reloadGames$ = new Subject<void>();
  readonly pageSize = 10;
  currentPage = signal(1);
  gamesResponse = toSignal(
    this.reloadGames$.pipe(
      startWith(void 0),
      switchMap(() => this.gamesService.allPaginated(this.currentPage(), this.pageSize)),
    ),
  );
  games = computed(() => this.gamesResponse()?.items ?? []);
  totalPages = computed(() => this.gamesResponse()?.totalPages ?? 1);
  isLoading = computed(() => !this.gamesResponse());
  showForm = signal(false);
  editingId = signal<string | null>(null);
  form = this.fb.group({
    slug: [''],
    name: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    image: ['', [Validators.required]],
    description: [''],
    platforms: [''],
  });

  startCreate() {
    this.editingId.set(null);
    this.showForm.set(true);
    this.form.reset({
      slug: '',
      name: '',
      price: 0,
      image: '',
      description: '',
      platforms: '',
    });
  }

  startEdit(game: Game) {
    this.editingId.set(game._id);
    this.showForm.set(true);
    this.form.reset({
      slug: game.slug,
      name: game.name,
      price: game.price,
      image: game.image,
      description: game.description ?? '',
      platforms: game.platforms.join(', '),
    });
  }

  cancelForm() {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  save() {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const name = raw.name?.trim() ?? '';
    const slug = (raw.slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    const platforms = (raw.platforms ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      slug,
      name,
      price: Number(raw.price),
      image: raw.image?.trim() ?? '',
      description: raw.description?.trim() ?? '',
      platforms,
    };
    const editingId = this.editingId();
    const request$ = editingId
      ? this.gamesService.update(editingId, payload)
      : this.gamesService.create(payload);

    request$.subscribe(() => {
      this.cancelForm();
      this.currentPage.set(1);
      this.reloadGames$.next();
    });
  }

  remove(id: string) {
    this.gamesService.remove(id).subscribe(() => this.reloadGames$.next());
  }

  nextPage() {
    if (this.currentPage() >= this.totalPages()) return;
    this.currentPage.update((value) => value + 1);
    this.reloadGames$.next();
  }

  prevPage() {
    if (this.currentPage() <= 1) return;
    this.currentPage.update((value) => value - 1);
    this.reloadGames$.next();
  }
}
