import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@core/models/user.model';

export interface UserDto {
  id: number;
  username: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);

  getAll(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>('/users');
  }

  getById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`/users/${id}`);
  }

  create(payload: Partial<UserDto>): Observable<UserDto> {
    return this.http.post<UserDto>('/users', payload);
  }

  update(id: number, payload: Partial<UserDto>): Observable<UserDto> {
    return this.http.put<UserDto>(`/users/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/users/${id}`);
  }
}