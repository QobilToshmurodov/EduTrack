# EduTrack Frontend - AI Agent Instructions

## Project Overview
EduTrack frontend is a modern Angular 21 single-page application (SPA) for college/technical school management. Built with standalone components, signals, and Angular Material. This document provides complete context for AI agents working on the frontend.

---

## Technology Stack

- **Framework:** Angular 21 (latest)
- **Language:** TypeScript 5.7
- **UI Library:** Angular Material 21
- **State Management:** Angular Signals (native)
- **Styling:** SCSS + Angular Material theming
- **HTTP Client:** Angular HttpClient
- **Routing:** Angular Router with lazy loading
- **Architecture:** Standalone components, Zoneless

---

## Project Structure

```
ClientApp/src/app/
├── core/                          # Singleton services & utilities
│   ├── guards/
│   │   ├── auth.guard.ts         # CanActivateFn - checks authentication
│   │   └── role.guard.ts         # CanActivateFn - checks user role
│   │
│   ├── interceptors/
│   │   ├── api.interceptor.ts    # HttpInterceptorFn - adds base URL & token
│   │   └── error.interceptor.ts  # HttpInterceptorFn - global error handling
│   │
│   ├── services/
│   │   ├── auth.service.ts       # Authentication with signals
│   │   └── storage.service.ts    # LocalStorage wrapper
│   │
│   └── models/
│       ├── user.model.ts         # User, UserRole enum, Login DTOs
│       └── api-response.model.ts # Generic API response types
│
├── shared/                        # Reusable components & utilities
│   ├── components/
│   │   └── loading/              # Loading spinner component
│   │
│   ├── material/
│   │   └── material.imports.ts   # All Material module imports
│   │
│   ├── models/
│   │   └── common.models.ts      # Group, Subject, Student, Teacher
│   │
│   └── services/
│       └── common-data.service.ts # Groups, Subjects data service
│
└── features/                      # Feature modules (lazy loaded)
    ├── auth/
    │   ├── login/                # Login component
    │   └── auth.routes.ts        # Auth routing
    │
    └── cabinet/                  # Main application dashboard
        ├── layout/               # Cabinet layout with sidenav
        │
        ├── director/             # Director/Admin panel
        │   ├── dashboard/
        │   ├── statistics/
        │   └── director.routes.ts
        │
        ├── teacher/              # Teacher panel
        │   ├── assignments/
        │   │   └── assignment-list/  # Full implementation
        │   ├── attendance/
        │   │   └── attendance-mark/  # Placeholder
        │   ├── services/
        │   │   ├── assignment.service.ts   # Signal-based
        │   │   └── attendance.service.ts   # Signal-based
        │   ├── models/
        │   │   ├── assignment.model.ts
        │   │   └── attendance.model.ts
        │   └── teacher.routes.ts
        │
        ├── student/              # Student panel
        │   ├── my-assignments/   # Placeholder
        │   ├── my-grades/        # Placeholder
        │   ├── my-attendance/    # Placeholder
        │   ├── services/
        │   │   └── student.service.ts
        │   ├── models/
        │   │   └── submission.model.ts
        │   └── student.routes.ts
        │
        └── cabinet.routes.ts     # Cabinet routing with guards
```

---

## Key Angular 21 Features Used

### 1. Standalone Components
All components are standalone - no NgModules used.

```typescript
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent { }
```

### 2. Signals for State Management
Using Angular Signals instead of RxJS BehaviorSubject.

```typescript
export class AssignmentService {
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
}
```

### 3. Computed Signals
```typescript
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  currentUser = this.currentUserSignal.asReadonly();
  
  isAuthenticated = computed(() => this.currentUserSignal() !== null);
  userRole = computed(() => this.currentUserSignal()?.role ?? null);
  isAdmin = computed(() => this.userRole() === UserRole.Admin);
}
```

### 4. Signal-based Templates
```typescript
// Component
assignmentService = inject(AssignmentService);

// Template
@if (assignmentService.loading()) {
  <app-loading></app-loading>
} @else {
  <mat-table [dataSource]="assignmentService.assignments()">
    <!-- table content -->
  </mat-table>
}
```

### 5. Functional Guards
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/auth/login']);
  return false;
};

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const userRole = authService.getUserRole();
    
    return allowedRoles.includes(userRole) ? true : false;
  };
};
```

### 6. HTTP Interceptors (Functional)
```typescript
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  let apiReq = req.clone({
    url: `${environment.apiUrl}${req.url}`
  });
  
  if (token) {
    apiReq = apiReq.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(apiReq);
};
```

### 7. Dependency Injection with inject()
```typescript
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  // No constructor needed!
}
```

---

## Routing Architecture

### Main Routes
```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: '/cabinet', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes')
  },
  {
    path: 'cabinet',
    canActivate: [authGuard],
    loadChildren: () => import('./features/cabinet/cabinet.routes')
  }
];
```

### Cabinet Routes (with Role Guards)
```typescript
// cabinet.routes.ts
export const CABINET_ROUTES: Routes = [
  {
    path: '',
    component: CabinetLayoutComponent,
    children: [
      {
        path: 'director',
        canActivate: [roleGuard([UserRole.Admin, UserRole.Director])],
        loadChildren: () => import('./director/director.routes')
      },
      {
        path: 'teacher',
        canActivate: [roleGuard([UserRole.Teacher])],
        loadChildren: () => import('./teacher/teacher.routes')
      },
      {
        path: 'student',
        canActivate: [roleGuard([UserRole.Student])],
        loadChildren: () => import('./student/student.routes')
      }
    ]
  }
];
```

---

## Data Flow Pattern

### DTO to Model Mapping
```typescript
// Backend DTO (from API)
interface AssignmentDto {
  id: number;
  subjectId: number;
  groupId: number;
  teacherId: number;
  title: string;
  deadline: string;  // ISO string
}

// Frontend Model (for UI)
interface Assignment {
  id: number;
  title: string;
  deadline: Date;    // Converted to Date
  subjectId: number;
  groupId: number;
  teacherId: number;
  status?: AssignmentStatus;  // Computed
}

// Service mapping
private mapToModel(dto: AssignmentDto): Assignment {
  const deadline = new Date(dto.deadline);
  const status = this.calculateStatus(deadline);
  
  return {
    ...dto,
    deadline,
    status
  };
}
```

### Service Pattern
```typescript
@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private http = inject(HttpClient);
  
  // Signal state
  private assignmentsSignal = signal<Assignment[]>([]);
  assignments = this.assignmentsSignal.asReadonly();
  
  // CRUD operations
  getAll(): Observable<Assignment[]> {
    return this.http.get<AssignmentDto[]>('/assignments').pipe(
      map(dtos => dtos.map(dto => this.mapToModel(dto))),
      tap(assignments => this.assignmentsSignal.set(assignments))
    );
  }
  
  create(data: CreateAssignmentDto): Observable<Assignment> {
    return this.http.post<AssignmentDto>('/assignments', data).pipe(
      map(dto => this.mapToModel(dto)),
      tap(assignment => {
        this.assignmentsSignal.update(prev => [...prev, assignment]);
      })
    );
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/assignments/${id}`).pipe(
      tap(() => {
        this.assignmentsSignal.update(prev => 
          prev.filter(a => a.id !== id)
        );
      })
    );
  }
}
```

---

## Angular Material Usage

### Importing Modules
```typescript
// shared/material/material.imports.ts
export const MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  // ... 21 modules total
];
```

### Using in Components
```typescript
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule
  ]
})
```

### Material Theming
```scss
// styles.scss
@import '@angular/material/prebuilt-themes/azure-blue.css';

// Custom overrides
.mat-mdc-snack-bar-container.error-snackbar {
  --mdc-snackbar-container-color: #f44336;
}
```

---

## Authentication Flow

### 1. Login Process
```typescript
// login.component.ts
onSubmit(): void {
  if (this.loginForm.valid) {
    this.loading.set(true);
    
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.snackBar.open('Success!', 'Close', { duration: 3000 });
        this.authService.navigateToDefaultRoute();
      },
      error: (error) => {
        this.loading.set(false);
        this.snackBar.open(error.message, 'Close', { duration: 5000 });
      }
    });
  }
}
```

### 2. AuthService
```typescript
login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>('/auth/login', credentials).pipe(
    tap(response => {
      // Store token
      this.storage.setToken(response.token);
      
      // Store user
      const user: User = {
        id: response.id,
        username: response.username,
        role: response.role as UserRole
      };
      this.storage.setUser(user);
      
      // Update signal
      this.currentUserSignal.set(user);
    })
  );
}

logout(): void {
  this.storage.clear();
  this.currentUserSignal.set(null);
  this.router.navigate(['/auth/login']);
}
```

### 3. Role-based Navigation
```typescript
navigateToDefaultRoute(): void {
  const role = this.userRole();
  
  switch (role) {
    case UserRole.Admin:
    case UserRole.Director:
      this.router.navigate(['/cabinet/director/dashboard']);
      break;
    case UserRole.Teacher:
      this.router.navigate(['/cabinet/teacher/assignments']);
      break;
    case UserRole.Student:
      this.router.navigate(['/cabinet/student/my-assignments']);
      break;
  }
}
```

---

## Environment Configuration

### Development
```typescript
// environment.development.ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001/api'
};
```

### Production
```typescript
// environment.ts
export const environment = {
  production: true,
  apiUrl: '/api'  // Relative URL for same-origin deployment
};
```

### Usage
```typescript
import { environment } from '@environments/environment';

const apiReq = req.clone({
  url: `${environment.apiUrl}${req.url}`
});
```

---

## Path Aliases

Configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@environments/*": ["src/environments/*"]
    }
  }
}
```

Usage:
```typescript
import { AuthService } from '@core/services/auth.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { environment } from '@environments/environment';
```

---

## Component Patterns

### Smart Component (Container)
```typescript
@Component({
  selector: 'app-assignment-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, LoadingComponent]
})
export class AssignmentListComponent implements OnInit {
  assignmentService = inject(AssignmentService);
  
  ngOnInit(): void {
    this.assignmentService.getAll().subscribe();
  }
  
  deleteAssignment(id: number): void {
    if (confirm('Delete?')) {
      this.assignmentService.delete(id).subscribe();
    }
  }
}
```

### Presentational Component
```typescript
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="loading-container">
      <mat-spinner></mat-spinner>
      <p>Loading...</p>
    </div>
  `
})
export class LoadingComponent {}
```

---

## Form Handling

### Reactive Forms with Signals
```typescript
export class LoginComponent {
  private fb = inject(FormBuilder);
  
  loginForm: FormGroup;
  loading = signal(false);
  hidePassword = signal(true);
  
  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }
  
  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }
}
```

### Template
```html
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
  <mat-form-field>
    <input matInput formControlName="username" [disabled]="loading()">
    @if (loginForm.get('username')?.hasError('required')) {
      <mat-error>Required</mat-error>
    }
  </mat-form-field>
  
  <button mat-raised-button [disabled]="loginForm.invalid || loading()">
    @if (loading()) {
      <mat-spinner diameter="20"></mat-spinner>
    } @else {
      <span>Login</span>
    }
  </button>
</form>
```

---

## Error Handling

### Global Error Interceptor
```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          authService.logout();
          break;
        case 403:
          router.navigate(['/cabinet/unauthorized']);
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
      }
      
      return throwError(() => new Error(error.error?.message || 'Error occurred'));
    })
  );
};
```

### Service Level Error Handling
```typescript
getAll(): Observable<Assignment[]> {
  this.loadingSignal.set(true);
  
  return this.http.get<AssignmentDto[]>('/assignments').pipe(
    map(dtos => dtos.map(dto => this.mapToModel(dto))),
    tap(assignments => {
      this.assignmentsSignal.set(assignments);
      this.loadingSignal.set(false);
    }),
    catchError(error => {
      this.loadingSignal.set(false);
      console.error('Failed to load assignments:', error);
      return of([]);  // Return empty array on error
    })
  );
}
```

---

## Styling Guidelines

### Component Styles
```scss
// assignment-list.component.scss
.assignments-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-card {
  mat-card-header {
    display: flex;
    justify-content: space-between;
    
    h2 {
      margin: 0;
      font-size: 1.5rem;
    }
  }
}

// Status chips
mat-chip {
  &.status-active {
    background-color: #4caf50 !important;
    color: white !important;
  }
  
  &.status-expired {
    background-color: #f44336 !important;
    color: white !important;
  }
}

// Responsive
@media (max-width: 768px) {
  .header-card {
    mat-card-header {
      flex-direction: column;
      gap: 1rem;
    }
  }
}
```

### Global Styles
```scss
// styles.scss
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

// Utility classes
.full-width { width: 100%; }
.text-center { text-align: center; }
.mt-2 { margin-top: 1rem; }
.p-2 { padding: 1rem; }
```

---

## Development Workflow

### Creating New Feature
```bash
# 1. Create component
ng g c features/cabinet/teacher/assignments/assignment-create --standalone

# 2. Create service (if needed)
ng g s features/cabinet/teacher/services/assignment

# 3. Create models
# Manually create in models/ folder

# 4. Add route
# Update teacher.routes.ts

# 5. Import in component
# Add necessary Material modules
```

### Component Checklist
- [ ] Standalone: true
- [ ] Proper imports (CommonModule, Material modules)
- [ ] Signal-based state (if needed)
- [ ] Dependency injection with inject()
- [ ] Error handling
- [ ] Loading states
- [ ] Responsive design
- [ ] Accessibility (aria labels)

---

## Testing Guidelines

### Unit Testing Template
```typescript
describe('AssignmentService', () => {
  let service: AssignmentService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AssignmentService]
    });
    
    service = TestBed.inject(AssignmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should fetch assignments', () => {
    const mockAssignments: AssignmentDto[] = [
      { id: 1, title: 'Test', /* ... */ }
    ];
    
    service.getAll().subscribe(assignments => {
      expect(assignments.length).toBe(1);
    });
    
    const req = httpMock.expectOne('/assignments');
    expect(req.request.method).toBe('GET');
    req.flush(mockAssignments);
  });
});
```

---

## Performance Optimization

### 1. Lazy Loading
All feature modules are lazy loaded:
```typescript
{
  path: 'cabinet',
  loadChildren: () => import('./features/cabinet/cabinet.routes')
}
```

### 2. OnPush Change Detection (optional)
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 3. TrackBy Functions
```html
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}
```

### 4. Signal Benefits
- Automatic change detection
- Better performance than zone.js
- Zoneless architecture (Angular 21 default)

---

## Known Issues & TODO

### Current Implementation:
✅ Authentication & Authorization
✅ Cabinet Layout with Sidenav
✅ Role-based Routing
✅ Teacher - Assignment List
✅ Signal-based Services
✅ HTTP Interceptors
✅ Error Handling

### Missing Features:
❌ Assignment Create/Edit forms
❌ Attendance marking interface
❌ Student submission interface
❌ Grading interface
❌ Director statistics/charts
❌ File upload functionality
❌ QR code integration
❌ Real-time notifications
❌ Advanced search/filter
❌ Pagination
❌ Unit tests

---

## AI Agent Instructions

When working on this frontend:

### DO:
1. ✅ Use standalone components (no NgModules)
2. ✅ Use signals for state management
3. ✅ Use inject() for dependency injection
4. ✅ Follow existing folder structure
5. ✅ Import Material modules as needed
6. ✅ Map DTOs to Models in services
7. ✅ Add loading states
8. ✅ Handle errors gracefully
9. ✅ Make components responsive
10. ✅ Use path aliases (@core, @shared, @features)

### DON'T:
1. ❌ Create NgModules
2. ❌ Use constructor for DI (use inject())
3. ❌ Use BehaviorSubject (use signals)
4. ❌ Expose services publicly in templates
5. ❌ Forget loading/error states
6. ❌ Mix DTOs and Models
7. ❌ Hardcode API URLs (use environment)
8. ❌ Ignore TypeScript strict mode
9. ❌ Skip SCSS for styling
10. ❌ Forget responsive design

### Common Tasks:

**Add New Component:**
1. Create standalone component
2. Import necessary modules
3. Add to routes (if page)
4. Create service (if needed)
5. Create models/DTOs
6. Implement UI with Material
7. Add loading/error states
8. Test functionality

**Add New Service:**
1. Create service with @Injectable
2. Use signals for state
3. Inject HttpClient
4. Implement CRUD methods
5. Map DTOs to Models
6. Handle errors
7. Export service

**Add New Route:**
1. Create component
2. Add to routes file
3. Add guard (if protected)
4. Update navigation menu
5. Test routing

---

## Debugging Tips

### Signal Debugging
```typescript
// In component
effect(() => {
  console.log('Assignments changed:', this.assignmentService.assignments());
});
```

### HTTP Debugging
Check browser DevTools:
- Network tab for API calls
- Console for errors
- Application > Local Storage for tokens

### Common Issues:

**CORS Error:**
- Backend CORS not configured
- Check backend Program.cs

**401 Unauthorized:**
- Token expired or invalid
- Check localStorage for token
- Verify interceptor is adding token

**Route not found:**
- Check routes configuration
- Verify lazy loading paths
- Check guard permissions

---

## Resources

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Last Updated:** 2025-02-07  
**Version:** 1.0.0 MVP  
**Status:** Active Development  
**Angular Version:** 21.0.0
