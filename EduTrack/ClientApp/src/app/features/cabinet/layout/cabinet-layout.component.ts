import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
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
    MatBadgeModule
  ],
  templateUrl: './cabinet-layout.component.html',
  styleUrl: './cabinet-layout.component.scss'
})
export class CabinetLayoutComponent {
  authService = inject(AuthService);
  
  sidenavOpened = signal(true);

  menuItems: MenuItem[] = [
    // Director/Admin
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/cabinet/director/dashboard',
      roles: [UserRole.Admin, UserRole.Director]
    },
    {
      label: 'Statistika',
      icon: 'bar_chart',
      route: '/cabinet/director/statistics',
      roles: [UserRole.Admin, UserRole.Director]
    },
    
    // Teacher
    {
      label: 'Topshiriqlar',
      icon: 'assignment',
      route: '/cabinet/teacher/assignments',
      roles: [UserRole.Teacher]
    },
    {
      label: 'Davomat',
      icon: 'fact_check',
      route: '/cabinet/teacher/attendance',
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
    },
    {
      label: 'Davomatim',
      icon: 'event_available',
      route: '/cabinet/student/my-attendance',
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
      case UserRole.Director:
        return 'Direktor';
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

  logout(): void {
    this.authService.logout();
  }
}
