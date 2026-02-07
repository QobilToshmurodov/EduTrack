import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { LoginRequest, LoginResponse, User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private router = inject(Router);

  // Signal-based state
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  currentUser = this.currentUserSignal.asReadonly();

  // Computed signals
  isAuthenticated = computed(() => this.currentUserSignal() !== null);
  userRole = computed(() => this.currentUserSignal()?.role ?? null);
  isAdmin = computed(() => this.userRole() === UserRole.Admin || this.userRole() === UserRole.Director);
  isTeacher = computed(() => this.userRole() === UserRole.Teacher);
  isStudent = computed(() => this.userRole() === UserRole.Student);

  private loadUserFromStorage(): User | null {
    const user = this.storage.getUser();
    const token = this.storage.getToken();
    return user && token ? user : null;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/Auth/login', credentials).pipe(
      tap(response => {
        this.storage.setToken(response.token);
        
        const user: User = {
          id: response.id,
          username: response.username,
          role: response.role as UserRole
        };
        
        this.storage.setUser(user);
        this.currentUserSignal.set(user);
      })
    );
  }

  logout(): void {
    this.storage.clear();
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.storage.getToken();
  }

  getUserRole(): UserRole | null {
    return this.currentUserSignal()?.role ?? null;
  }

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
      default:
        this.router.navigate(['/auth/login']);
    }
  }
}
