import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_URLS} from '../config/api.config';
import {Statistics} from '../models/statistics.model'; // Импортируем нашу новую модель

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private http = inject(HttpClient);

  /**
   * Получает всю статистику платформы
   */
  getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(API_URLS.STATISTICS);
  }
}
