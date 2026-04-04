// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard для защиты маршрутов (только авторизованные)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Сохраняем URL для возврата после входа
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

// Guard для обратного: доступ ТОЛЬКО неавторизованным (для login/register)
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Если уже авторизован — редирект на профиль или главную
  const currentUser = authService.getCurrentUser();
  if (currentUser) {
    router.navigate(['/profile', currentUser.id]);
  } else {
    router.navigate(['/main']);
  }
  return false;
};
