import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import {
  AssignmentDto,
  Assignment,
  CreateAssignmentDto,
  UpdateAssignmentDto,
  AssignmentStatus
} from '../models/assignment.model';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private http = inject(HttpClient);

  // Signal-based state
  private assignmentsSignal = signal<Assignment[]>([]);
  assignments = this.assignmentsSignal.asReadonly();

  private loadingSignal = signal(false);
  loading = this.loadingSignal.asReadonly();

  getAll(): Observable<Assignment[]> {
    this.loadingSignal.set(true);
    return this.http.get<AssignmentDto[]>('/assignments').pipe(
      map(dtos => dtos.map(dto => this.mapToModel(dto))),
      tap(assignments => {
        this.assignmentsSignal.set(assignments);
        this.loadingSignal.set(false);
      })
    );
  }

  getById(id: number): Observable<Assignment> {
    return this.http.get<AssignmentDto>(`/assignments/${id}`).pipe(
      map(dto => this.mapToModel(dto))
    );
  }

  create(data: CreateAssignmentDto): Observable<Assignment> {
    return this.http.post<AssignmentDto>('/assignments', data).pipe(
      map(dto => this.mapToModel(dto)),
      tap(assignment => {
        this.assignmentsSignal.update(assignments => [...assignments, assignment]);
      })
    );
  }

  update(id: number, data: UpdateAssignmentDto): Observable<Assignment> {
    return this.http.put<AssignmentDto>(`/assignments/${id}`, data).pipe(
      map(dto => this.mapToModel(dto)),
      tap(updatedAssignment => {
        this.assignmentsSignal.update(assignments =>
          assignments.map(a => a.id === id ? updatedAssignment : a)
        );
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/assignments/${id}`).pipe(
      tap(() => {
        this.assignmentsSignal.update(assignments =>
          assignments.filter(a => a.id !== id)
        );
      })
    );
  }

  private mapToModel(dto: AssignmentDto): Assignment {
    const deadline = new Date(dto.deadline);
    const now = new Date();
    
    let status: AssignmentStatus;
    if (deadline < now) {
      status = AssignmentStatus.Expired;
    } else if (deadline.getTime() - now.getTime() > 7 * 24 * 60 * 60 * 1000) {
      status = AssignmentStatus.Upcoming;
    } else {
      status = AssignmentStatus.Active;
    }

    return {
      id: dto.id,
      title: dto.title,
      deadline: deadline,
      subjectId: dto.subjectId,
      groupId: dto.groupId,
      teacherId: dto.teacherId,
      status
    };
  }
}
