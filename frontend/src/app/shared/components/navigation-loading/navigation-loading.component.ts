import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';

/**
 * Navigation feedback shown during route transitions:
 *  - Thin top progress bar (always-on during nav)
 *  - Full-screen branded overlay (with minimum visible duration so even
 *    instant navigations register visually)
 */
@Component({
  selector: 'app-navigation-loading',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  template: `
    @if (active()) {
      <div class="nav-progress-bar">
        <mat-progress-bar mode="indeterminate" color="accent"></mat-progress-bar>
      </div>
    }

    @if (overlay()) {
      <div class="nav-loading">
        <div class="nav-loading-card">
          <div class="logo-wrap">
            <img class="logo-img" src="img/logo.png" alt="" aria-hidden="true"/>
            <div class="ring"></div>
          </div>
          <div class="hint">Yuklanmoqda...</div>
          <div class="dots" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: contents; }

    /* ============ TOP THIN PROGRESS BAR ============ */
    .nav-progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 5100;
    }

    /* ============ CENTER OVERLAY ============ */
    .nav-loading {
      position: fixed;
      inset: 0;
      z-index: 5000;
      display: grid;
      place-items: center;
      background: rgba(246, 245, 241, 0.78);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      animation: nl-fade-in 180ms ease-out both;
    }

    [data-theme="dark"] .nav-loading {
      background: rgba(11, 16, 36, 0.78);
    }

    .nav-loading-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      padding: 36px 44px 30px;
      background: var(--et-surface);
      border: 1px solid var(--et-line);
      border-radius: var(--et-r-xl);
      box-shadow: var(--et-shadow-3);
      min-width: 240px;
      animation: nl-pop 240ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    /* Logo with rotating ring */
    .logo-wrap {
      position: relative;
      width: 84px;
      height: 84px;
      display: grid;
      place-items: center;
      margin-bottom: 8px;
    }

    .logo-img {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
      display: block;
      box-shadow: 0 12px 28px -8px rgba(14, 27, 61, 0.30);
      z-index: 2;
      background: var(--et-surface-2);
    }

    .ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 3px solid transparent;
      border-top-color: var(--et-primary-500);
      border-right-color: var(--et-accent-500);
      animation: nl-spin 0.9s linear infinite;
    }

    .hint {
      font: 600 11.5px/1 var(--et-font-sans);
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--et-ink-3);
    }

    /* Bouncing dots */
    .dots {
      display: inline-flex;
      gap: 6px;
      margin-top: 4px;
    }
    .dots span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--et-primary-500);
      animation: nl-bounce 1.1s ease-in-out infinite;
    }
    .dots span:nth-child(2) { background: var(--et-accent-500); animation-delay: 0.15s; }
    .dots span:nth-child(3) { background: var(--et-warm-500); animation-delay: 0.3s; }

    /* ============ KEYFRAMES ============ */
    @keyframes nl-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    @keyframes nl-pop {
      from { opacity: 0; transform: scale(0.92) translateY(8px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    @keyframes nl-spin {
      to { transform: rotate(360deg); }
    }

    @keyframes nl-bounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
      40%           { transform: scale(1);   opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce) {
      .nav-loading,
      .nav-loading-card { animation: none; }
      .ring { animation: none; }
      .dots span { animation: none; opacity: 1; }
    }
  `]
})
export class NavigationLoadingComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  /** Active = navigation in flight. Drives the top progress bar. */
  active = signal(false);

  /** Overlay = center fullscreen loader. Held for minVisibleMs so it doesn't flicker. */
  overlay = signal(false);

  /** Minimum time the overlay stays visible once shown. Long enough to feel deliberate. */
  private readonly minVisibleMs = 200;

  private overlayShownAt = 0;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.beginNav();
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.endNav();
        }
      });
  }

  private beginNav(): void {
    if (this.hideTimer !== null) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    this.active.set(true);
    if (!this.overlay()) {
      this.overlay.set(true);
      this.overlayShownAt = Date.now();
    }
  }

  private endNav(): void {
    this.active.set(false);

    const elapsed = Date.now() - this.overlayShownAt;
    const remaining = Math.max(0, this.minVisibleMs - elapsed);

    if (remaining === 0) {
      this.overlay.set(false);
    } else {
      this.hideTimer = setTimeout(() => {
        this.overlay.set(false);
        this.hideTimer = null;
      }, remaining);
    }
  }
}
