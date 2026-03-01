import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HeaderComponent} from "../header/header.component";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

interface University {
  id: number;
  name: string;
  city: string;
  athletes: number;
  coaches: number;
}

@Component({
  selector: 'app-universities',
  standalone: true,
  imports: [HeaderComponent, FormsModule, NgForOf],
  templateUrl: './universities.component.html',
  styleUrl: './universities.component.scss'
})

export class UniversitiesComponent {
  selectedCity: string = '';
  cities: string[] = []; // Будет заполнено уникальными городами
  universities: University[] = [];
  filteredUniversities: University[] = [];

  constructor(private router: Router) {
    this.loadMockData();
  }

  // Загрузка данных-заглушек
  loadMockData(): void {
    this.universities = [
      { id: 1, name: 'МГУ им. М.В. Ломоносова', city: 'Москва', athletes: 145, coaches: 28 },
      { id: 2, name: 'СПбГУ', city: 'Санкт-Петербург', athletes: 112, coaches: 22 },
      { id: 3, name: 'НГУ', city: 'Новосибирск', athletes: 85, coaches: 15 },
      { id: 4, name: 'КФУ', city: 'Казань', athletes: 98, coaches: 19 },
      { id: 5, name: 'УрФУ', city: 'Екатеринбург', athletes: 76, coaches: 14 },
      { id: 6, name: 'МГТУ им. Баумана', city: 'Москва', athletes: 130, coaches: 25 },
      { id: 7, name: 'ТГУ', city: 'Томск', athletes: 64, coaches: 12 },
      { id: 8, name: 'ДВФУ', city: 'Владивосток', athletes: 55, coaches: 10 },
      { id: 9, name: 'ЮФУ', city: 'Ростов-на-Дону', athletes: 70, coaches: 13 },
      { id: 10, name: 'Самарский университет', city: 'Самара', athletes: 60, coaches: 11 },
    ];

    // Извлекаем уникальные города для фильтра
    this.cities = Array.from(new Set(this.universities.map(u => u.city))).sort();

    // Инициализируем отфильтрованный список всеми вузами
    this.filteredUniversities = this.universities;
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
    // Переход на страницу конкретного вуза (пока заглушка)
    console.log('View university details:', id);
    // this.router.navigate(['/universities', id]);
  }
}
