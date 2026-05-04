import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { UserRole } from '@core/models/user.model';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: UserRole[];
}

const AVATAR_PALETTE = ['#4F5DE0', '#14B89A', '#F58A3D', '#8E47C7'];

@Component({
  selector: 'app-cabinet-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './cabinet-layout.component.html',
  styleUrl: './cabinet-layout.component.scss'
})
export class CabinetLayoutComponent implements OnInit {
  authService = inject(AuthService);
  private notify = inject(NotificationService);

  collapsed = signal(false);
  mobileOpen = signal(false);
  darkMode = signal(localStorage.getItem('et-theme') === 'dark');

  menuItems: MenuItem[] = [
    { label: 'Boshqaruv Paneli', icon: 'dashboard',       route: '/cabinet/director/dashboard',   roles: [UserRole.Admin] },
    { label: 'Yo\'nalishlar',    icon: 'school',          route: '/cabinet/director/professions', roles: [UserRole.Admin] },
    { label: 'Xodimlar',         icon: 'person',          route: '/cabinet/director/employees',   roles: [UserRole.Admin] },
    { label: 'O\'quvchilar',     icon: 'people',          route: '/cabinet/director/students',    roles: [UserRole.Admin] },
    { label: 'Guruhlar',         icon: 'groups',          route: '/cabinet/director/groups',      roles: [UserRole.Admin] },
    { label: 'Fanlar',           icon: 'book',            route: '/cabinet/director/subjects',    roles: [UserRole.Admin] },
    { label: 'Fan tayinlash',    icon: 'assignment_ind',  route: '/cabinet/director/esg',         roles: [UserRole.Admin] },
    { label: 'Yangiliklar',      icon: 'newspaper',       route: '/cabinet/director/news',        roles: [UserRole.Admin] },

    { label: 'Topshiriqlar',     icon: 'assignment',      route: '/cabinet/teacher/assignments',  roles: [UserRole.Teacher] },
    { label: 'Javoblar',         icon: 'fact_check',      route: '/cabinet/teacher/submissions',  roles: [UserRole.Teacher] },

    { label: 'Mening topshiriqlarim', icon: 'task',       route: '/cabinet/student/my-assignments', roles: [UserRole.Student] },
    { label: 'Baholarim',             icon: 'grade',      route: '/cabinet/student/my-grades',      roles: [UserRole.Student] }
  ];

  userInitials = computed(() => {
    const name = this.authService.currentUser()?.username ?? '??';
    return name.slice(0, 2).toUpperCase();
  });

  userColor = computed(() => {
    const name = this.authService.currentUser()?.username ?? '';
    let hash = 0;
    for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xfff;
    return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
  });

  ngOnInit(): void {
    if (this.darkMode()) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

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
      case UserRole.Admin:   return 'Administrator';
      case UserRole.Teacher: return 'O\'qituvchi';
      case UserRole.Student: return 'O\'quvchi';
      default: return '';
    }
  }

  toggleTheme(): void {
    this.darkMode.update(v => !v);
    if (this.darkMode()) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('et-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('et-theme', 'light');
    }
  }

  onNavItemClick(): void {
    if (window.innerWidth <= 900) {
      this.mobileOpen.set(false);
    }
  }

  async openLogoutModal(): Promise<void> {
    const ok = await this.notify.confirmLogout();
    if (ok) this.authService.logout();
  }
}
