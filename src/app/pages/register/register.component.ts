import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  lastName: string = '';
  firstName: string = '';
  middleName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/choose_role']);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  isFormValid(): boolean {
    return (
      this.lastName.trim() !== '' &&
      this.firstName.trim() !== '' &&
      this.email.trim() !== '' &&
      this.password.trim() !== '' &&
      this.password === this.confirmPassword
    );
  }


  onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }
    console.log('Register:', {
      lastName: this.lastName,
      firstName: this.firstName,
      middleName: this.middleName,
      email: this.email,
      password: this.password
    });
  }

  onGoToLogin(): void {
    this.router.navigate(['/login']);
  }
}
