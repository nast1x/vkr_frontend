import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {filter, map, take} from 'rxjs/operators';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.loading$.pipe(
    filter(isLoading => !isLoading),
    take(1),
    map(() => {
      if (authService.isAuthenticated()) {
        return true;
      }
      router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
    })
  );
};


export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.loading$.pipe(
    filter(isLoading => !isLoading),
    take(1),
    map(() => {
      if (!authService.isAuthenticated()) {
        return true;
      }
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        router.navigate(['/profile', currentUser.id]);
      } else {
        router.navigate(['/main']);
      }
      return false;
    })
  );
};
