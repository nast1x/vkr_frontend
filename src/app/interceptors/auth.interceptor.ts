import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
    if (error.status === 401 && !this.isAuthEndpoint(request.url)) {
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
