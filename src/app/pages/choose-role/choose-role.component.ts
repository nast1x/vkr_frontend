import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// 1. Создаём тип для роли
type RoleType = 'trainer' | 'athlete' | 'user';

interface Role {
  id: RoleType;
  title: string;
  subtitle: string;
  icon: string;
}

@Component({
  selector: 'app-choose-role',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './choose-role.component.html',
  styleUrl: './choose-role.component.scss'
})
export class ChooseRoleComponent {
  // 2. Храним выбранную роль
  selectedRole: RoleType | null = null;

  // 3. Явно указываем тип массива
  roles: Role[] = [
    { id: 'trainer', title: 'Тренер', subtitle: 'Профиль тренера', icon: '/assets/images/roles/trainer.svg' },
    { id: 'athlete', title: 'Спортсмен', subtitle: 'Профиль спортсмена', icon: '/assets/images/roles/athlete.svg' },
    { id: 'user', title: 'Пользователь', subtitle: 'Обычный пользователь', icon: '/assets/images/roles/user.svg' }
  ];

  constructor(private router: Router) {}

  // 4. Метод теперь принимает правильный тип
  selectRole(roleId: RoleType) {
    this.selectedRole = roleId;
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onRegister() {
    if (!this.selectedRole) {
      alert('Пожалуйста, выберите роль');
      return;
    }
    console.log('Регистрация с ролью:', this.selectedRole);
    this.router.navigate(['/register']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
