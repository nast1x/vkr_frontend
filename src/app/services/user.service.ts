import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG, API_URLS } from '../config/api.config';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  // Получение данных профиля
  getProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API_URLS.PROFILE}/${userId}`);
  }

  // Обновление личных данных
  updateProfile(userId: number, userData: any): Observable<any> {
    const updateUrl = `${API_CONFIG.BASE_URL}/api/users/${userId}`;
    return this.http.put(updateUrl, userData);
  }

  // Смена пароля
  changePassword(userId: number, payload: any): Observable<any> {
    const updateUrl = `${API_CONFIG.BASE_URL}/api/users/${userId}`;
    return this.http.put(updateUrl, payload);
  }

  // Загрузка фотографии профиля
  uploadProfilePhoto(formData: FormData): Observable<UserProfile> {
    const photoUrl = `${API_CONFIG.BASE_URL}/api/users/profile/photo`;
    return this.http.post<UserProfile>(photoUrl, formData, { withCredentials: true });
  }
}
