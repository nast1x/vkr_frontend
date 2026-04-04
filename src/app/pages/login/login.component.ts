
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  goBack(): void {
    this.router.navigate(['/register']);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Валидация формы
  isFormValid(): boolean {
    return this.email.trim() !== '' && this.password.trim() !== '';
  }

  // Отправка формы входа
  onSubmit(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Пожалуйста, введите email и пароль';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Вход успешен:', response);

        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
        const currentUser = this.authService.getCurrentUser();

        if (currentUser) {
          this.router.navigate([returnUrl]);
        } else {
          // Если профиль ещё не загрузился — пробуем получить его
          this.authService.getCurrentProfile().subscribe({
            next: (user) => {
              this.router.navigate([returnUrl]);
            },
            error: () => {
              this.router.navigate(['/login']);
            }
          });
        }
      },
      error: (err) => {
        // Ошибка уже обработана в AuthService
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  onGoToRegister(): void {
    this.router.navigate(['/register']);
  }
}
