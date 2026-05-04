import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { GroupDto, Group, SubjectDto, Subject } from '../models/common.models';

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {
  private http = inject(HttpClient);

  // Signal-based state
  private groupsSignal = signal<Group[]>([]);
  groups = this.groupsSignal.asReadonly();

  private subjectsSignal = signal<Subject[]>([]);
  subjects = this.subjectsSignal.asReadonly();

  // Groups
  getAllGroups(): Observable<Group[]> {
    return this.http.get<GroupDto[]>('/groups').pipe(
      map(dtos => dtos.map(dto => ({ id: dto.id, name: dto.name }))),
      tap(groups => this.groupsSignal.set(groups))
    );
  }

  getGroupById(id: number): Observable<Group> {
    return this.http.get<GroupDto>(`/groups/${id}`).pipe(
      map(dto => ({ id: dto.id, name: dto.name }))
    );
  }

  // Subjects
  getAllSubjects(): Observable<Subject[]> {
    return this.http.get<SubjectDto[]>('/subjects').pipe(
      map(dtos => dtos.map(dto => ({ id: dto.id, name: dto.name }))),
      tap(subjects => this.subjectsSignal.set(subjects))
    );
  }

  getSubjectById(id: number): Observable<Subject> {
    return this.http.get<SubjectDto>(`/subjects/${id}`).pipe(
      map(dto => ({ id: dto.id, name: dto.name }))
    );
  }
}
