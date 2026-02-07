import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatProgressBarModule, CommonModule],
  template: `
    <div class="progress-bar-container" *ngIf="loading()">
      <mat-progress-bar mode="indeterminate" color="accent"></mat-progress-bar>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .progress-bar-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'EduTrack';
  loading = signal(false);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading.set(true);
        this.cdr.detectChanges();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // Kichik kechikish qo'shamiz, shunda juda tez o'tishlarda ham ko'rinadi
        setTimeout(() => {
          this.loading.set(false);
          this.cdr.detectChanges();
        }, 300);
      }
    });
  }
}
