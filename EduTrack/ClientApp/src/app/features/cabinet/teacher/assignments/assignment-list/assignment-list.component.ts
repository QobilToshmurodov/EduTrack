import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment, AssignmentStatus } from '../../models/assignment.model';
import { LoadingComponent } from '@shared/components/loading/loading.component';

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
    LoadingComponent
  ],
  templateUrl: './assignment-list.component.html',
  styleUrl: './assignment-list.component.scss'
})
export class AssignmentListComponent implements OnInit {
  assignmentService = inject(AssignmentService);

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

  deleteAssignment(id: number): void {
    if (confirm('Topshiriqni o\'chirmoqchimisiz?')) {
      this.assignmentService.delete(id).subscribe({
        next: () => {
          console.log('Assignment deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting assignment:', error);
        }
      });
    }
  }
}
