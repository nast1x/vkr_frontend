import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { API_URLS } from '../../config/api.config';

interface Competition {
  idCompetition: number;
  name: string;
  competitionLevel: 'University Level' | 'City Level' | 'Regional Level' | 'All-Russian Level' | 'International Level';
  sportType: string;
  city: string;
  startDate: string;
  endDate: string | null;
}

@Component({
  selector: 'app-competitions',
  standalone: true,
  imports: [
    FormsModule,
    HeaderComponent
],
  templateUrl: './competitions.component.html',
  styleUrl: './competitions.component.scss'
})
export class CompetitionsComponent implements OnInit {
  selectedCity: string = '';
  selectedType: string = '';
  selectedStatus: string = '';
  activeTab: 'all' | 'upcoming' | 'ongoing' | 'completed' = 'all';
  cities: string[] = [];
  competitionTypes = [
    { value: 'University Level', label: 'Вузовские' },
    { value: 'City Level', label: 'Городские' },
    { value: 'Regional Level', label: 'Региональные' },
    { value: 'All-Russian Level', label: 'Российские' },
    { value: 'International Level', label: 'Международный' }
  ];
  competitions: Competition[] = [];
  filteredCompetitions: Competition[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCompetitions();
  }

  // Загрузка данных с бэкенда
  loadCompetitions(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<Competition[]>(API_URLS.COMPETITIONS)
      .subscribe({
        next: (data) => {
          this.competitions = data;
          // Извлекаем уникальные города для фильтра
          this.cities = Array.from(new Set(this.competitions.map(c => c.city))).sort();
          // Инициализируем отфильтрованный список всеми соревнованиями
          this.filteredCompetitions = this.competitions;
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
    this.filteredCompetitions = this.competitions.filter(comp => {
      // Фильтр по городу
      const cityMatch = !this.selectedCity || comp.city === this.selectedCity;

      // Фильтр по типу
      const typeMatch = !this.selectedType ||
        this.getLevelValue(comp.competitionLevel) === this.selectedType;

      // Фильтр по статусу
      let statusMatch = true;
      if (this.activeTab !== 'all') {
        statusMatch = this.getStatusValue(comp) === this.activeTab;
      } else if (this.selectedStatus) {
        statusMatch = this.getStatusValue(comp) === this.selectedStatus;
      }

      return cityMatch && typeMatch && statusMatch;
    });
  }

  // Преобразование уровня соревнования в значение фильтра
  getLevelValue(level: string): string {
    const mapping: { [key: string]: string } = {
      'University Level': 'university',
      'City Level': 'city',
      'Regional Level': 'regional',
      'Russian Level': 'russian'
    };
    return mapping[level] || '';
  }

  // Определение статуса соревнования
  getStatusValue(comp: Competition): 'upcoming' | 'ongoing' | 'completed' {
    const today = new Date();
    const startDate = new Date(comp.startDate);
    const endDate = comp.endDate ? new Date(comp.endDate) : null;

    if (endDate && endDate < today) {
      return 'completed';
    } else if (startDate <= today && (!endDate || endDate >= today)) {
      return 'ongoing';
    } else {
      return 'upcoming';
    }
  }

  setTab(tab: 'all' | 'upcoming' | 'ongoing' | 'completed'): void {
    this.activeTab = tab;
    this.selectedStatus = '';
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedCity = '';
    this.selectedType = '';
    this.selectedStatus = '';
    this.activeTab = 'all';
    this.applyFilters();
  }

  getTypeLabel(type: string): string {
    const typeObj = this.competitionTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'upcoming': 'Ожидаемое',
      'ongoing': 'Текущее',
      'completed': 'Завершено'
    };
    return labels[status] || status;
  }

  getLevelLabel(level: string): string {
    const mapping: { [key: string]: string } = {
      'University Level': 'Вузовские',
      'City Level': 'Городские',
      'Regional Level': 'Региональные',
      'Russian Level': 'Российские'
    };
    return mapping[level] || level;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  onViewDetails(id: number): void {
    // Переход на страницу конкретного соревнования
    this.router.navigate(['/competition-details', id]);
  }
}
