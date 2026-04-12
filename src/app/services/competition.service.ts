import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../config/api.config';
import { Competition } from '../models/competition.model';

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {
  private http = inject(HttpClient);

  getCompetitionById(id: string): Observable<Competition> {
    return this.http.get<Competition>(`${API_URLS.COMPETITIONS}/${id}`);
  }
}
