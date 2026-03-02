import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {HeaderComponent} from "../header/header.component";
import {Router} from "@angular/router";

interface Competition {
  id: number;
  name: string;
  city: string;
  startDate: string;
  endDate: string;
  type: 'university' | 'city' | 'regional' | 'russian';
  status: 'upcoming' | 'ongoing' | 'completed';
}

@Component({
  selector: 'app-competitions',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    HeaderComponent
  ],
  templateUrl: './competitions.component.html',
  styleUrl: './competitions.component.scss'
})
export class CompetitionsComponent {
  selectedCity: string = '';
  selectedType: string = '';
  selectedStatus: string = '';
  activeTab: 'all' | 'upcoming' | 'ongoing' | 'completed' = 'all';

  cities: string[] = [];
  competitionTypes = [
    { value: 'university', label: 'Вузовские' },
    { value: 'city', label: 'Городские' },
    { value: 'regional', label: 'Региональные' },
    { value: 'russian', label: 'Российские' }
  ];

  competitions: Competition[] = [];
  filteredCompetitions: Competition[] = [];

  constructor(private router: Router) {
    this.loadMockData();
  }

  loadMockData(): void {
    this.competitions = [
      {
        id: 1,
        name: 'Чемпионат города по плаванию',
        city: 'Москва',
        startDate: '15.03.2024',
        endDate: '17.03.2024',
        type: 'city',
        status: 'upcoming'
      },
      {
        id: 2,
        name: 'Вузовская спартакиада',
        city: 'Санкт-Петербург',
        startDate: '01.04.2024',
        endDate: '05.04.2024',
        type: 'university',
        status: 'upcoming'
      },
      {
        id: 3,
        name: 'Областной турнир по лёгкой атлетике',
        city: 'Казань',
        startDate: '10.02.2024',
        endDate: '12.02.2024',
        type: 'regional',
        status: 'ongoing'
      },
      {
        id: 4,
        name: 'Первенство России по плаванию',
        city: 'Москва',
        startDate: '20.01.2024',
        endDate: '25.01.2024',
        type: 'russian',
        status: 'completed'
      },
      {
        id: 5,
        name: 'Зимний кубок вузов',
        city: 'Новосибирск',
        startDate: '15.01.2024',
        endDate: '18.01.2024',
        type: 'university',
        status: 'completed'
      },
      {
        id: 6,
        name: 'Городской марафон',
        city: 'Екатеринбург',
        startDate: '20.03.2024',
        endDate: '20.03.2024',
        type: 'city',
        status: 'upcoming'
      },
      {
        id: 7,
        name: 'Региональные соревнования по гимнастике',
        city: 'Ростов-на-Дону',
        startDate: '05.02.2024',
        endDate: '07.02.2024',
        type: 'regional',
        status: 'completed'
      },
      {
        id: 8,
        name: 'Кубок России по настольному теннису',
        city: 'Самара',
        startDate: '25.02.2024',
        endDate: '28.02.2024',
        type: 'russian',
        status: 'ongoing'
      },
    ];

    this.cities = Array.from(new Set(this.competitions.map(c => c.city))).sort();
    this.filteredCompetitions = this.competitions;
  }

  applyFilters(): void {
    this.filteredCompetitions = this.competitions.filter(comp => {
      // Фильтр по городу
      const cityMatch = !this.selectedCity || comp.city === this.selectedCity;

      // Фильтр по типу
      const typeMatch = !this.selectedType || comp.type === this.selectedType;

      // Фильтр по статусу
      let statusMatch = true;
      if (this.activeTab !== 'all') {
        statusMatch = comp.status === this.activeTab;
      } else if (this.selectedStatus) {
        statusMatch = comp.status === this.selectedStatus;
      }

      return cityMatch && typeMatch && statusMatch;
    });
  }

  setTab(tab: 'all' | 'upcoming' | 'ongoing' | 'completed'): void {
    this.activeTab = tab;
    this.selectedStatus = ''; // Сбрасываем фильтр статуса при переключении вкладки
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

  onViewDetails(id: number): void {
    // Переход на страницу конкретного соревнования
    this.router.navigate(['/competitions', id]);
  }
}
