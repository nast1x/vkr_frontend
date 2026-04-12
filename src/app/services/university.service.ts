import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../config/api.config';
import { University } from '../models/university.model';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private http = inject(HttpClient);

  getUniversities(): Observable<University[]> {
    return this.http.get<University[]>(API_URLS.UNIVERSITY_STATS);
  }
}
