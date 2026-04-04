import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {} // ✅ Убрали AuthService

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Добавляем credentials: 'include' только для /api/* запросов
    if (req.url.includes('/api/')) {
      const authReq = req.clone({
        withCredentials: true
      });
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleAuthError(error, authReq, next);
        })
      );
    }
    return next.handle(req);
  }

  private handleAuthError(
    error: HttpErrorResponse,
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Если 401 и это не запрос на логин/регистрацию/рефреш/логаут
    if (error.status === 401 && !this.isAuthEndpoint(request.url)) {
      // ❌ НЕ делаем рефреш здесь — это задача AuthService
      // Просто редиректим на логин
      this.router.navigate(['/login']);
      return throwError(() => error);
    }
    return throwError(() => error);
  }

  private isAuthEndpoint(url: string): boolean {
    return url.includes('/api/auth/login') ||
      url.includes('/api/auth/register') ||
      url.includes('/api/auth/refresh') ||
      url.includes('/api/auth/logout');
  }
}
