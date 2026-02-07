import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm: FormGroup;
  loading = signal(false);
  hidePassword = signal(true);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.loading()) {
      this.loading.set(true);

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.snackBar.open('Muvaffaqiyatli kirdingiz!', 'Yopish', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.authService.navigateToDefaultRoute();
        },
        error: (error) => {
          this.loading.set(false);
          this.snackBar.open(
            error.message || 'Login yoki parol xato!',
            'Yopish',
            {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }
}
