import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FormsModule } from "@angular/forms";

import { HttpClient } from "@angular/common/http";
import { API_URLS } from '../../config/api.config';
import {NgOptimizedImage} from "@angular/common";
import {PageDecorComponent} from "../../shared/components/page-decor/page-decor.component";
import {LoaderComponent} from "../../shared/components/loader/loader.component";
import {ErrorStateComponent} from "../../shared/components/error-state/error-state.component";

interface SportsFacility {
  idSportFacility: number;
  name: string;
  imageLink: string;
  city: string;
  address: string;
  description: string;
  sportTypes: string;
}

@Component({
  selector: 'app-sports-facilities',
  standalone: true,
  imports: [HeaderComponent, FormsModule, NgOptimizedImage, PageDecorComponent, LoaderComponent, ErrorStateComponent],
  templateUrl: './sports-facilities.component.html',
  styleUrl: './sports-facilities.component.scss'
})
export class SportsFacilitiesComponent implements OnInit {
  selectedCity: string = '';
  cities: string[] = [];
  facilities: SportsFacility[] = [];
  filteredFacilities: SportsFacility[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadFacilities();
  }

  loadFacilities(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<SportsFacility[]>(API_URLS.SPORT_FACILITIES_LIST)
      .subscribe({
        next: (data) => {
          this.facilities = data;
          this.cities = Array.from(new Set(this.facilities.map(f => f.city))).sort();
          this.filteredFacilities = this.facilities;
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
      this.filteredFacilities = this.facilities;
    } else {
      this.filteredFacilities = this.facilities.filter(
        facility => facility.city === this.selectedCity
      );
    }
  }

  resetFilters(): void {
    this.selectedCity = '';
    this.applyFilters();
  }

  onViewDetails(id: number): void {
    this.router.navigate(['/sports-facilities-detail', id]);
  }
}
