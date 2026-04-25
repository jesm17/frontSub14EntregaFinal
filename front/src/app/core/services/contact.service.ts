import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private readonly http: HttpClient) {}

  send(payload: { name: string; email: string; message: string }) {
    return this.http.post(`${API_URL}/contact`, payload);
  }
}
