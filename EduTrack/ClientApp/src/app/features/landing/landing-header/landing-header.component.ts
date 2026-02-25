import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatIcon} from "@angular/material/icon";
import { AuthService } from '@core/services/auth.service';
import {MatButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIcon, MatButton, MatTooltip],
  templateUrl: './landing-header.component.html',
  styleUrl: './landing-header.component.scss'
})
export class LandingHeaderComponent {
  authService = inject(AuthService);
  menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.closeMenu();
    this.authService.logout();
  }
}
