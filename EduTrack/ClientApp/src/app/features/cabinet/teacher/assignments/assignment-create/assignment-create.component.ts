import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AssignmentService } from '../../services/assignment.service';
import { GroupsService } from '@core/services/groups.service';
import { SubjectsService } from '@core/services/subjects.service';

interface Group {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

@Component({
  selector: 'app-assignment-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './assignment-create.component.html',
  styleUrl: './assignment-create.component.scss'
})
export class AssignmentCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private assignmentService = inject(AssignmentService);
  private groupsService = inject(GroupsService);
  private subjectsService = inject(SubjectsService);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);
  groups = signal<Group[]>([]);
  subjects = signal<Subject[]>([]);
  editMode = signal(false);
  assignmentId = signal<number | null>(null);

  assignmentForm: FormGroup;
  minDate = new Date();

  constructor() {
    this.assignmentForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      subjectId: [null, Validators.required],
      groupId: [null, Validators.required],
      deadline: [null, Validators.required],
      maxScore: [100, [Validators.required, Validators.min(1), Validators.max(1000)]]
    });
  }

  ngOnInit(): void {
    this.loadData();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode.set(true);
      this.assignmentId.set(+id);
      this.loadAssignment(+id);
    }
  }

  private loadData(): void {
    Promise.all([
      this.groupsService.getAll().toPromise(),
      this.subjectsService.getAll().toPromise()
    ]).then(([groups, subjects]) => {
      this.groups.set(groups || []);
      this.subjects.set(subjects || []);
    }).catch(error => {
      console.error('Failed to load data:', error);
      this.snackBar.open('Ma\'lumotlarni yuklashda xatolik', 'Yopish', { duration: 3000 });
    });
  }

  private loadAssignment(id: number): void {
    this.loading.set(true);
    this.assignmentService.getById(id).subscribe({
      next: (assignment: any) => {
        this.assignmentForm.patchValue({
          title: assignment.title,
          description: assignment.description || '',
          subjectId: assignment.subjectId,
          groupId: assignment.groupId,
          deadline: new Date(assignment.deadline),
          maxScore: assignment.maxScore || 100
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load assignment:', error);
        this.snackBar.open('Topshiriqni yuklashda xatolik', 'Yopish', { duration: 3000 });
        this.loading.set(false);
        this.goBack();
      }
    });
  }

  onSubmit(): void {
    if (this.assignmentForm.valid) {
      this.loading.set(true);
      const formData = this.assignmentForm.value;

      if (this.editMode()) {
        this.assignmentService.update(this.assignmentId()!, formData).subscribe({
          next: () => {
            this.snackBar.open('Topshiriq muvaffaqiyatli yangilandi', 'Yopish', { duration: 3000 });
            this.goBack();
          },
          error: (error) => {
            console.error('Failed to update assignment:', error);
            this.snackBar.open('Yangilashda xatolik', 'Yopish', { duration: 3000 });
            this.loading.set(false);
          }
        });
      } else {
        this.assignmentService.create(formData).subscribe({
          next: () => {
            this.snackBar.open('Topshiriq muvaffaqiyatli yaratildi', 'Yopish', { duration: 3000 });
            this.goBack();
          },
          error: (error) => {
            console.error('Failed to create assignment:', error);
            this.snackBar.open('Yaratishda xatolik', 'Yopish', { duration: 3000 });
            this.loading.set(false);
          }
        });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/cabinet/teacher/assignments']);
  }
}
