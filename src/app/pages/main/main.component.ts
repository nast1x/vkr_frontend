import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HeaderComponent} from "../header/header.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HeaderComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  constructor(private router: Router) {}

  onProfile(): void {
    this.router.navigate(['/profile']);
  }

  onViewAllNews(): void {
    this.router.navigate(['/news']);
  }

  onViewAllResults(): void {
    this.router.navigate(['/results']);
  }
}
