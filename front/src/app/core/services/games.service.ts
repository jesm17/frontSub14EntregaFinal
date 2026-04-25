import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api';
import { Game } from '../models';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class GamesService {
  constructor(private readonly http: HttpClient) {}

  all() {
    return this.http.get<Game[]>(`${API_URL}/games`);
  }

  allPaginated(page: number, limit: number) {
    return this.http.get<PaginatedResponse<Game>>(`${API_URL}/games/paginated?page=${page}&limit=${limit}`);
  }

  offers() {
    return this.http.get<Game[]>(`${API_URL}/games/offers`);
  }

  offersPaginated(page: number, limit: number) {
    return this.http.get<PaginatedResponse<Game>>(`${API_URL}/games/offers/paginated?page=${page}&limit=${limit}`);
  }

  outstanding() {
    return this.http.get<Game[]>(`${API_URL}/games/outstanding`);
  }

  byId(id: string) {
    return this.http.get<Game>(`${API_URL}/games/${id}`);
  }

  create(payload: Partial<Game>) {
    return this.http.post<Game>(`${API_URL}/games`, payload);
  }

  update(id: string, payload: Partial<Game>) {
    return this.http.patch<Game>(`${API_URL}/games/${id}`, payload);
  }

  remove(id: string) {
    return this.http.delete(`${API_URL}/games/${id}`);
  }
}
