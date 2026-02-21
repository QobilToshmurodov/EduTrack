import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupDto } from '@shared/models/common.models';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private http = inject(HttpClient);
  private base = '/Groups';

  getAll(): Observable<GroupDto[]> {
    return this.http.get<GroupDto[]>(this.base);
  }

  getById(id: number): Observable<GroupDto> {
    return this.http.get<GroupDto>(`${this.base}/${id}`);
  }

  create(data: { name: string; professionId?: number }): Observable<GroupDto> {
    return this.http.post<GroupDto>(this.base, data);
  }

  update(id: number, data: { name: string; professionId?: number }): Observable<GroupDto> {
    return this.http.put<GroupDto>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
