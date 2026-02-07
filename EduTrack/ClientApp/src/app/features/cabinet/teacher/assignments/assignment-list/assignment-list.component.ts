import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment, AssignmentStatus } from '../../models/assignment.model';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { AssignmentDialogComponent, AssignmentDialogData } from '../assignment-dialog/assignment-dialog.component';

@Component({
  selector: 'app-assignment-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    LoadingComponent
  ],
  templateUrl: './assignment-list.component.html',
  styleUrl: './assignment-list.component.scss'
})
export class AssignmentListComponent implements OnInit {
  assignmentService = inject(AssignmentService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['title', 'deadline', 'status', 'actions'];

  ngOnInit(): void {
    this.assignmentService.getAll().subscribe();
  }

  getStatusClass(status: AssignmentStatus | undefined): string {
    switch (status) {
      case AssignmentStatus.Active:
        return 'status-active';
      case AssignmentStatus.Expired:
        return 'status-expired';
      case AssignmentStatus.Upcoming:
        return 'status-upcoming';
      default:
        return '';
    }
  }

  getStatusLabel(status: AssignmentStatus | undefined): string {
    switch (status) {
      case AssignmentStatus.Active:
        return 'Faol';
      case AssignmentStatus.Expired:
        return 'Muddati o\'tgan';
      case AssignmentStatus.Upcoming:
        return 'Kutilmoqda';
      default:
        return '';
    }
  }

  openDialog(assignment?: Assignment): void {
    const dialogRef = this.dialog.open(AssignmentDialogComponent, {
      width: '600px',
      data: assignment || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (assignment) {
          this.updateAssignment(assignment.id, result);
        } else {
          this.createAssignment(result);
        }
      }
    });
  }

  private createAssignment(data: any): void {
    this.assignmentService.create(data).subscribe({
      next: () => {
        this.snackBar.open('Topshiriq muvaffaqiyatli qo\'shildi', 'Yopish', { duration: 3000 });
      },
      error: (error) => {
        console.error('Failed to create assignment:', error);
        this.snackBar.open('Qo\'shishda xatolik', 'Yopish', { duration: 3000 });
      }
    });
  }

  private updateAssignment(id: number, data: any): void {
    this.assignmentService.update(id, data).subscribe({
      next: () => {
        this.snackBar.open('Topshiriq muvaffaqiyatli yangilandi', 'Yopish', { duration: 3000 });
      },
      error: (error) => {
        console.error('Failed to update assignment:', error);
        this.snackBar.open('Yangilashda xatolik', 'Yopish', { duration: 3000 });
      }
    });
  }

  deleteAssignment(id: number): void {
    if (confirm('Topshiriqni o\'chirmoqchimisiz?')) {
      this.assignmentService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Topshiriq o\'chirildi', 'Yopish', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting assignment:', error);
          this.snackBar.open('O\'chirishda xatolik', 'Yopish', { duration: 3000 });
        }
      });
    }
  }
}
