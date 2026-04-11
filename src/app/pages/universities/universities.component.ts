import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FormsModule } from "@angular/forms";

import { HttpClient } from "@angular/common/http";
import { API_URLS } from '../../config/api.config';

interface University {
  idUniversity: number;
  shortName: string;
  city: string;
  athletesCount: number;
  coachesCount: number;
}

@Component({
  selector: 'app-universities',
  standalone: true,
  imports: [HeaderComponent, FormsModule],
  templateUrl: './universities.component.html',
  styleUrl: './universities.component.scss'
})
export class UniversitiesComponent implements OnInit {
  selectedCity: string = '';
  cities: string[] = [];
  universities: University[] = [];
  filteredUniversities: University[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUniversities();
  }

  loadUniversities(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<University[]>(API_URLS.UNIVERSITY_STATS)
      .subscribe({
        next: (data) => {
          this.universities = data;
          this.cities = Array.from(new Set(this.universities.map(u => u.city))).sort();
          this.filteredUniversities = this.universities;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка загрузки данных:', err);
          this.error = 'Не удалось загрузить данные. Проверьте подключение к серверу.';
          this.isLoading = false;
        }
      });
  }

  applyFilters(): void {
    if (!this.selectedCity) {
      this.filteredUniversities = this.universities;
    } else {
      this.filteredUniversities = this.universities.filter(
        uni => uni.city === this.selectedCity
      );
    }
  }

  resetFilters(): void {
    this.selectedCity = '';
    this.applyFilters();
  }

  onViewDetails(id: number): void {
    this.router.navigate(['/universities-details', id]);
  }
}
