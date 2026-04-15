import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_CONFIG, API_URLS} from '../config/api.config';
import {SportRankAssignmentDto, UserProfile} from '../models/user.model';
import {SportRank, SportType} from "../models/sport.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  /**
   * Получение данных профиля
   * */
  getProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API_URLS.PROFILE}/${userId}`);
  }

  /**
   * Обновление личных данных
   * */
  updateProfile(userId: number, userData: any): Observable<any> {
    const updateUrl = API_URLS.USER_BY_ID(userId);
    return this.http.put(updateUrl, userData);
  }

  /**
   * Смена пароля
   * */
  changePassword(userId: number, payload: any): Observable<any> {
    const updateUrl = API_URLS.USER_BY_ID(userId);
    return this.http.put(updateUrl, payload);
  }

  /**
   * Загрузка фотографии профиля
   * */
  uploadProfilePhoto(formData: FormData): Observable<UserProfile> {
    const photoUrl = `${API_CONFIG.BASE_URL}/api/users/profile/photo`;
    return this.http.post<UserProfile>(photoUrl, formData, {withCredentials: true});
  }
  /**
   * Изменение спортивного разряда пользователя тренером
   * */
  assignSportRank(data: SportRankAssignmentDto): Observable<any> {
    return this.http.post<UserProfile>(`${API_URLS.ACHIEVEMENT}/assign-rank`, data);
  }

  /**
   * Получение видос спорта
   * */
  getSportTypes(): Observable<SportType[]> {
    return this.http.get<SportType[]>(`${API_URLS.SPORT_TYPE}`);
  }
  /**
   * Получение спортивных званий
   * */
  getSportRanks(): Observable<SportRank[]> {
    return this.http.get<SportRank[]>(`${API_URLS.SPORT_RANK}`);
  }
}
