import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { NgForOf, NgIf } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { API_URLS } from '../../config/api.config';

interface GeneralStats {
  totalAthletes: number;
  totalCoaches: number;
  totalUniversities: number;
  totalCompetitions: number;
}

interface UniversityRanking {
  id?: number;
  name: string;
  city: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

interface AthleteRanking {
  id: number;
  name: string;
  avatar: string;
  university: string;
  sport: string;
  medals: number;
  competitions: number;
}

interface SportStatistics {
  name: string;
  athletes: number;
  competitions: number;
  facilities: number;
  percentage: number;
}

interface CityStatistics {
  name: string;
  athletes: number;
  competitions: number;
  total: number;
}

interface Statistics {
  generalStats: GeneralStats;
  topUniversities: UniversityRanking[];
  topAthletes: AthleteRanking[];
  sportsStatistics: SportStatistics[];
  cityStatistics: CityStatistics[];
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [HeaderComponent, NgForOf, NgIf],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  currentDate: string;
  stats!: Statistics;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.currentDate = new Date().toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<Statistics>(API_URLS.STATISTICS)
      .subscribe({
        next: (data) => {
          this.stats = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка загрузки данных:', err);
          this.error = 'Не удалось загрузить данные. Проверьте подключение к серверу.';
          this.isLoading = false;
        }
      });
  }

  onAthleteClick(athleteId: number): void {
    this.router.navigate(['/profile', athleteId]);
  }

  onUniversityClick(universityId: number): void {
    this.router.navigate(['/universities-details', universityId]);
  }
}
