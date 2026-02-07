import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupDto, Group } from '@shared/models/common.models';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private http = inject(HttpClient);

  getAll(): Observable<GroupDto[]> {
    return this.http.get<GroupDto[]>('/groups');
  }

  getById(id: number): Observable<GroupDto> {
    return this.http.get<GroupDto>(`/groups/${id}`);
  }

  create(payload: Partial<GroupDto>): Observable<GroupDto> {
    return this.http.post<GroupDto>('/groups', payload);
  }

  update(id: number, payload: Partial<GroupDto>): Observable<GroupDto> {
    return this.http.put<GroupDto>(`/groups/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/groups/${id}`);
  }
}