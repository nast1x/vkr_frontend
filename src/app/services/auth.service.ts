import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import {API_URLS} from '../config/api.config';
import {AuthResponse, LoginRequest, RegisterRequest, User} from "../models/user.model";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    this.loadingSubject.next(true);

    this.http.get<User>(API_URLS.PROFILE_ME, {withCredentials: true})
      .pipe(
        catchError((error) => {
          this.currentUserSubject.next(null);
          this.loadingSubject.next(false);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
          this.loadingSubject.next(false);
        },
        error: () => {
          this.currentUserSubject.next(null);
          this.loadingSubject.next(false);
        }
      });
  }

  /**
   * Регистрация
   * */
  register(data: RegisterRequest): Observable<AuthResponse> {
    this.loadingSubject.next(true);

    return this.http.post<AuthResponse>(
      API_URLS.AUTH_REGISTER,
      data,
      {withCredentials: true}
    ).pipe(
      tap(() => {
        this.checkAuthStatus();
      }),
      catchError(this.handleError),
      tap(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Авторизация
   * */
  login(data: LoginRequest): Observable<AuthResponse> {
    this.loadingSubject.next(true);

    return this.http.post<AuthResponse>(
      API_URLS.AUTH_LOGIN,
      data,
      {withCredentials: true}
    ).pipe(
      tap(() => {
        this.checkAuthStatus();
      }),
      catchError(this.handleError),
      tap(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Выход
   * */
  logout(): Observable<void> {
    return this.http.post<void>(
      API_URLS.AUTH_LOGOUT,
      {},
      {withCredentials: true}
    ).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Получить профиль пользователя
   * */
  getCurrentProfile(): Observable<User> {
    return this.http.get<User>(API_URLS.PROFILE_ME, {withCredentials: true})
      .pipe(
        tap(user => this.currentUserSubject.next(user)),
        catchError(this.handleError)
      );
  }

  /**
   * Проверка на авторизацию
   * */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Польчуить информацию о пользователе
   * */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Перегазрузить профиль
   * */
  refreshUserProfile(): void {
    this.getCurrentProfile().subscribe();
  }

  /**
   * Ошибки
   * */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMsg = 'Произошла ошибка. Попробуйте позже.';

    if (error.status === 0) {
      errorMsg = 'Нет соединения с сервером. Проверьте подключение к интернету.';
    } else if (error.status === 400) {
      errorMsg = 'Неверные данные. Проверьте заполнение формы.';
    } else if (error.status === 401) {
      errorMsg = 'Неавторизован. Пожалуйста, войдите в систему.';
    } else if (error.status === 403) {
      errorMsg = 'Доступ запрещён.';
    } else if (error.status === 404) {
      errorMsg = 'Пользователь не найден.';
    } else if (error.status === 409) {
      errorMsg = 'Пользователь с таким email уже существует.';
    } else if (error.status >= 500) {
      errorMsg = 'Ошибка сервера. Попробуйте позже.';
    }
    console.error('Auth error:', error);
    return throwError(() => new Error(errorMsg));
  }
}
