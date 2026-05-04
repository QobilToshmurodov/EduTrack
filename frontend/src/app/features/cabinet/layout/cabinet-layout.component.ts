import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@core/models/user.model';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: UserRole[];
}

@Component({
  selector: 'app-cabinet-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './cabinet-layout.component.html',
  styleUrl: './cabinet-layout.component.scss'
})
export class CabinetLayoutComponent {
  authService = inject(AuthService);

  sidenavOpened = signal(true);
  showLogoutModal = signal(false);

  menuItems: MenuItem[] = [
    // Admin
    {
      label: 'Boshqaruv Paneli',
      icon: 'dashboard',
      route: '/cabinet/director/dashboard',
      roles: [UserRole.Admin]
    },
    {
      label: 'Yo\'nalishlar',
      icon: 'school',
      route: '/cabinet/director/professions',
      roles: [UserRole.Admin]
    },
    {
      label: 'Xodimlar',
      icon: 'person',
      route: '/cabinet/director/employees',
      roles: [UserRole.Admin]
    },
    {
      label: 'O\'quvchilar',
      icon: 'people',
      route: '/cabinet/director/students',
      roles: [UserRole.Admin]
    },
    {
      label: 'Guruhlar',
      icon: 'groups',
      route: '/cabinet/director/groups',
      roles: [UserRole.Admin]
    },
    {
      label: 'Fanlar',
      icon: 'book',
      route: '/cabinet/director/subjects',
      roles: [UserRole.Admin]
    },
    {
      label: 'Fan tayinlash',
      icon: 'assignment_ind',
      route: '/cabinet/director/esg',
      roles: [UserRole.Admin]
    },
    {
      label: 'Yangiliklar',
      icon: 'newspaper',
      route: '/cabinet/director/news',
      roles: [UserRole.Admin]
    },

    // Teacher
    {
      label: 'Topshiriqlar',
      icon: 'assignment',
      route: '/cabinet/teacher/assignments',
      roles: [UserRole.Teacher]
    },
    {
      label: 'Javoblar',
      icon: 'fact_check',
      route: '/cabinet/teacher/submissions',
      roles: [UserRole.Teacher]
    },

    // Student
    {
      label: 'Mening topshiriqlarim',
      icon: 'task',
      route: '/cabinet/student/my-assignments',
      roles: [UserRole.Student]
    },
    {
      label: 'Baholarim',
      icon: 'grade',
      route: '/cabinet/student/my-grades',
      roles: [UserRole.Student]
    }
  ];

  get filteredMenuItems(): MenuItem[] {
    const userRole = this.authService.userRole();
    if (!userRole) return [];
    return this.menuItems.filter(item => item.roles.includes(userRole));
  }

  get userDisplayName(): string {
    return this.authService.currentUser()?.username || 'Foydalanuvchi';
  }

  get userRoleDisplay(): string {
    const role = this.authService.userRole();
    switch (role) {
      case UserRole.Admin:
        return 'Administrator';
      case UserRole.Teacher:
        return 'O\'qituvchi';
      case UserRole.Student:
        return 'O\'quvchi';
      default:
        return '';
    }
  }

  toggleSidenav(): void {
    this.sidenavOpened.update(value => !value);
  }

  onNavItemClick(): void {
    if (window.innerWidth <= 1024) {
      this.sidenavOpened.set(false);
    }
  }

  openLogoutModal(): void {
    this.showLogoutModal.set(true);
  }

  closeLogoutModal(): void {
    this.showLogoutModal.set(false);
  }

  confirmLogout(): void {
    this.showLogoutModal.set(false);
    this.authService.logout();
  }
}
