// src/app/pages/register/register.component.ts
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  // Данные формы
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  firstName: string = '';
  lastName: string = '';
  middleName: string = '';
  gender: 'Male' | 'Female' = 'Male';
  roleName: 'Athlete' | 'Coach' = 'Athlete';

  // UI состояния
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  // ✅ Опции для выбора пола
  genderOptions = [
    { value: 'Male', label: 'Мужской' },
    { value: 'Female', label: 'Женский' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  goBack(): void {
    this.router.navigate(['/']);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Валидация формы
  isFormValid(): boolean {
    return (
      this.email.trim() !== '' &&
      this.firstName.trim() !== '' &&
      this.lastName.trim() !== '' &&
      this.middleName.trim() !== '' &&
      this.password.trim() !== '' &&
      this.password === this.confirmPassword &&
      this.password.length >= 6
    );
  }

  // Отправка формы регистрации
  onSubmit(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Пожалуйста, заполните все поля корректно';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Формируем запрос согласно документации бэкенда
    const registerData = {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      middleName: this.middleName,
      gender: this.gender, // ✅ Добавлен пол
      roleName: this.roleName
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Регистрация успешна:', response);

        const currentUser = this.authService.getCurrentUser();

        if (currentUser) {
          this.router.navigate(['/profile', currentUser.id]);
        } else {
          this.authService.getCurrentProfile().subscribe({
            next: (user) => {
              this.router.navigate(['/profile', user.id]);
            },
            error: () => {
              this.router.navigate(['/login']);
            }
          });
        }
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  onGoToLogin(): void {
    this.router.navigate(['/login']);
  }
}
