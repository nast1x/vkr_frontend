import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/choose_role']);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // Логика авторизации
    console.log('Login:', this.email, this.password);
    this.router.navigate(['/main']);
  }

  onForgotPassword(): void {
    // Логика восстановления пароля
    console.log('Forgot password');
  }

  onGoToRegister(): void {
    this.router.navigate(['/choose_role']);
  }
}
