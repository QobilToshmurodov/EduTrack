import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [RouterLink, MatIcon],
  templateUrl: './landing-footer.component.html',
  styleUrl: './landing-footer.component.scss'
})
export class LandingFooterComponent {
  currentYear = new Date().getFullYear();
}
