import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import {
  SubmissionDto,
  Submission,
  CreateSubmissionDto,
  GradeDto,
  Grade,
  CreateGradeDto
} from '../models/submission.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);

  // Signal-based state
  private submissionsSignal = signal<Submission[]>([]);
  submissions = this.submissionsSignal.asReadonly();

  private gradesSignal = signal<Grade[]>([]);
  grades = this.gradesSignal.asReadonly();

  private loadingSignal = signal(false);
  loading = this.loadingSignal.asReadonly();

  // Submissions
  getAllSubmissions(): Observable<Submission[]> {
    this.loadingSignal.set(true);
    return this.http.get<SubmissionDto[]>('/submissions').pipe(
      map(dtos => dtos.map(dto => this.mapSubmissionToModel(dto))),
      tap(submissions => {
        this.submissionsSignal.set(submissions);
        this.loadingSignal.set(false);
      })
    );
  }

  createSubmission(data: CreateSubmissionDto): Observable<Submission> {
    return this.http.post<SubmissionDto>('/submissions', data).pipe(
      map(dto => this.mapSubmissionToModel(dto)),
      tap(submission => {
        this.submissionsSignal.update(submissions => [...submissions, submission]);
      })
    );
  }

  // Grades
  getAllGrades(): Observable<Grade[]> {
    this.loadingSignal.set(true);
    return this.http.get<GradeDto[]>('/grades').pipe(
      map(dtos => dtos.map(dto => this.mapGradeToModel(dto))),
      tap(grades => {
        this.gradesSignal.set(grades);
        this.loadingSignal.set(false);
      })
    );
  }

  createGrade(data: CreateGradeDto): Observable<Grade> {
    return this.http.post<GradeDto>('/grades', data).pipe(
      map(dto => this.mapGradeToModel(dto)),
      tap(grade => {
        this.gradesSignal.update(grades => [...grades, grade]);
      })
    );
  }

  private mapSubmissionToModel(dto: SubmissionDto): Submission {
    return {
      id: dto.id,
      assignmentId: dto.assignmentId,
      studentId: dto.studentId,
      fileUrl: dto.fileUrl
    };
  }

  private mapGradeToModel(dto: GradeDto): Grade {
    return {
      id: dto.id,
      submissionId: dto.submissionId,
      teacherId: dto.teacherId,
      score: dto.score
    };
  }
}
