import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationLoadingComponent } from '@shared/components/navigation-loading/navigation-loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationLoadingComponent],
  template: `
    <app-navigation-loading></app-navigation-loading>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'EduTrack';
}
