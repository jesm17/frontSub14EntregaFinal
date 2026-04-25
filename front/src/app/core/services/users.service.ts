import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private readonly http: HttpClient) {}

  me() {
    return this.http.get<User>(`${API_URL}/users/me`);
  }
}
