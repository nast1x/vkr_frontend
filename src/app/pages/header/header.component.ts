import { Component } from '@angular/core';
import {Router, RouterLinkActive, RouterModule} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLinkActive, RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private router: Router) {}

  onProfile(): void {
    this.router.navigate(['/profile']);
  }
}
