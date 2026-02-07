# EduTrack - Angular Frontend

Kollej va texnikumlar uchun boshqaruv tizimi (Frontend qismi)

## 🚀 Texnologiyalar

- **Angular 21** - Standalone Components, Signals, Zoneless
- **Angular Material** - UI komponenti kutubxonasi
- **TypeScript 5.7** - Strict type checking
- **SCSS** - Styling
- **RxJS** - Reactive programming

## 📁 Proyekt Strukturasi

```
ClientApp/
├── src/
│   ├── app/
│   │   ├── core/                    # Singleton servislar
│   │   │   ├── guards/              # Auth & Role guards
│   │   │   ├── interceptors/        # HTTP interceptors
│   │   │   ├── services/            # Auth, Storage
│   │   │   └── models/              # User, API Response
│   │   │
│   │   ├── shared/                  # Reusable komponentlar
│   │   │   ├── components/          # Header, Sidebar, Loading
│   │   │   ├── material/            # Material imports
│   │   │   └── models/              # Common models
│   │   │
│   │   └── features/                # Feature modules
│   │       ├── auth/                # Login
│   │       └── cabinet/             # Dashboard
│   │           ├── layout/          # Cabinet layout
│   │           ├── director/        # Direktor
│   │           ├── teacher/         # O'qituvchi
│   │           └── student/         # O'quvchi
│   │
│   ├── environments/                # Environment configs
│   └── styles/                      # Global styles
│
├── angular.json
├── package.json
└── tsconfig.json
```

## 🎯 Asosiy Xususiyatlar

### ✅ Signal-based State Management
```typescript
// Service
private assignmentsSignal = signal<Assignment[]>([]);
assignments = this.assignmentsSignal.asReadonly();

// Component
assignmentService = inject(AssignmentService);
@if (assignmentService.loading()) {
  <app-loading></app-loading>
}
```

### ✅ Standalone Components
```typescript
@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule]
})
```

### ✅ Functional Guards
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  // Guard logic
};
```

### ✅ HTTP Interceptors
```typescript
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Interceptor logic
};
```

## 🔧 O'rnatish

```bash
# Dependencies o'rnatish
npm install

# Development server
npm start

# Production build
npm run build
```

## 🌐 Environment Configuration

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
  apiUrl: '/api'
};
```

## 🛡️ Security

- JWT token-based authentication
- Role-based access control (RBAC)
- Route guards
- HTTP interceptors

## 👥 User Roles

1. **Admin/Director** - Sistema boshqaruvi, statistika
2. **Teacher** - Topshiriqlar, davomat
3. **Student** - Topshiriqlar ko'rish, baholar

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 600px, 768px, 1024px
- Material Design principles

## 🎨 UI/UX

- Angular Material components
- Consistent design language
- Loading states
- Error handling
- User feedback (snackbars)

## 🔄 State Management

- Signal-based reactive state
- Service-level state management
- Automatic UI updates

## 📡 API Integration

- HTTP Client
- DTO to Model mapping
- Error handling
- Loading states

## 🚧 MVP Scope

**Implemented:**
- ✅ Authentication (Login)
- ✅ Cabinet Layout
- ✅ Role-based routing
- ✅ Teacher Assignments (List)
- ✅ Service layer
- ✅ Models & DTOs

**To be implemented:**
- ⏳ Assignment Create/Edit
- ⏳ Attendance marking
- ⏳ Student submissions
- ⏳ Grading interface
- ⏳ Director statistics
- ⏳ File upload

## 📝 Development Guidelines

### Component Creation
```bash
# Standalone component
ng g c features/cabinet/teacher/components/my-component --standalone
```

### Service Creation
```bash
# Injectable service
ng g s features/cabinet/teacher/services/my-service
```

### Code Style
- Use signals for reactive state
- Prefer standalone components
- Follow Material Design guidelines
- Use TypeScript strict mode
- Implement proper error handling

## 🤝 Contributing

1. Feature branchlar yarating
2. Code review'dan o'tkazing
3. Testlarni yozing
4. Documentatsiya qo'shing

## 📞 Support

Savollar uchun: [your-email@example.com]

---

**EduTrack** - Zamonaviy kollejlar uchun zamonaviy yechim! 🎓
