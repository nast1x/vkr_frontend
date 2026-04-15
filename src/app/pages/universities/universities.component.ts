import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HeaderComponent} from "../header/header.component";
import {FormsModule} from "@angular/forms";
import {LoaderComponent} from '../../shared/components/loader/loader.component';
import {ErrorStateComponent} from '../../shared/components/error-state/error-state.component';
import {PageDecorComponent} from '../../shared/components/page-decor/page-decor.component';

import {HttpClient} from "@angular/common/http";
import {University} from "../../models/university.model";
import {UniversityService} from "../../services/university.service";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-universities',
  standalone: true,
  imports: [HeaderComponent, FormsModule, LoaderComponent, ErrorStateComponent, PageDecorComponent, NgOptimizedImage],
  templateUrl: './universities.component.html',
  styleUrl: './universities.component.scss'
})
export class UniversitiesComponent implements OnInit {
  private universityService = inject(UniversityService);
  selectedCity: string = '';
  cities: string[] = [];
  universities: University[] = [];
  filteredUniversities: University[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.loadUniversities();
  }

  loadUniversities(): void {
    this.isLoading = true;
    this.error = null;

    this.universityService.getUniversities().subscribe({
      next: (data) => {
        this.universities = data;
        this.cities = Array.from(new Set(this.universities.map(u => u.city))).sort();
        this.filteredUniversities = this.universities;
        this.isLoading = false;
      },
      error: (err) => {
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
