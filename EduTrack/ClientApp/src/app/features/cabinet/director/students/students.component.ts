import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StudentsService } from '@core/services/students.service';
import { GroupsService } from '@core/services/groups.service';
import { StudentDialogComponent, StudentDialogData } from './student-dialog/student-dialog.component';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  groupId: number;
  groupName?: string;
}

interface Group {
  id: number;
  name: string;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {
  private studentsService = inject(StudentsService);
  private groupsService = inject(GroupsService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  loading = signal(true);
  students = signal<Student[]>([]);
  groups = signal<Group[]>([]);
  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'groupName', 'actions'];

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);

    Promise.all([
      this.studentsService.getAll().toPromise(),
      this.groupsService.getAll().toPromise()
    ]).then(([students, groups]) => {
      this.groups.set(groups || []);
      
      const studentsWithGroups = (students || []).map(student => ({
        ...student,
        groupName: groups?.find(g => g.id === student.groupId)?.name || 'N/A'
      })) as unknown as Student[];
      
      this.students.set(studentsWithGroups);
      this.loading.set(false);
    }).catch(error => {
      console.error('Failed to load data:', error);
      this.snackBar.open('Ma\'lumotlarni yuklashda xatolik', 'Yopish', { duration: 3000 });
      this.loading.set(false);
    });
  }

  openDialog(student?: Student): void {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      width: '600px',
      data: student || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (student) {
          this.updateStudent(student.id, result);
        } else {
          this.createStudent(result);
        }
      }
    });
  }

  private createStudent(data: any): void {
    this.studentsService.create(data).subscribe({
      next: () => {
        this.snackBar.open('O\'quvchi muvaffaqiyatli qo\'shildi', 'Yopish', { duration: 3000 });
        this.loadData();
      },
      error: (error) => {
        console.error('Failed to create student:', error);
        this.snackBar.open('Qo\'shishda xatolik', 'Yopish', { duration: 3000 });
      }
    });
  }

  private updateStudent(id: number, data: any): void {
    this.studentsService.update(id, data).subscribe({
      next: () => {
        this.snackBar.open('O\'quvchi muvaffaqiyatli yangilandi', 'Yopish', { duration: 3000 });
        this.loadData();
      },
      error: (error) => {
        console.error('Failed to update student:', error);
        this.snackBar.open('Yangilashda xatolik', 'Yopish', { duration: 3000 });
      }
    });
  }

  deleteStudent(id: number): void {
    if (confirm('Rostdan ham bu o\'quvchini o\'chirmoqchimisiz?')) {
      this.studentsService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('O\'quvchi muvaffaqiyatli o\'chirildi', 'Yopish', { duration: 3000 });
          this.loadData();
        },
        error: (error) => {
          console.error('Failed to delete student:', error);
          this.snackBar.open('O\'chirishda xatolik', 'Yopish', { duration: 3000 });
        }
      });
    }
  }
}
