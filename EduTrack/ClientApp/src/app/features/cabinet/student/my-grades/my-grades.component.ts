import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GradesService } from '@core/services/grades.service';

interface Grade {
  id: number;
  assignmentTitle: string;
  subjectName: string;
  score: number;
  maxScore: number;
  percentage: number;
  gradedDate: Date;
  feedback?: string;
}

@Component({
  selector: 'app-my-grades',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './my-grades.component.html',
  styleUrl: './my-grades.component.scss'
})
export class MyGradesComponent implements OnInit {
  private gradesService = inject(GradesService);
  private snackBar = inject(MatSnackBar);

  loading = signal(true);
  grades = signal<Grade[]>([]);
  displayedColumns = ['assignmentTitle', 'subjectName', 'score', 'percentage', 'gradedDate'];

  ngOnInit(): void {
    this.loadGrades();
  }

  private loadGrades(): void {
    this.loading.set(true);
    // TODO: Implement getMyGrades in GradesService
    // Mock data for now
    setTimeout(() => {
      this.grades.set([]);
      this.loading.set(false);
    }, 500);
  }

  getAverageScore(): number {
    const grades = this.grades();
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade.percentage, 0);
    return Math.round(sum / grades.length);
  }

  getGradeColor(percentage: number): string {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 70) return 'good';
    if (percentage >= 50) return 'average';
    return 'poor';
  }
}
