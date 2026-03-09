import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HeaderComponent} from "../header/header.component";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

interface SportsFacility {
  id: number;
  name: string;
  type: 'open' | 'closed' | 'indoor' | 'outdoor';
  city: string;
  sport: string;
  photo: string;
  description: string;
  address: string;
}
@Component({
  selector: 'app-sports-facilities',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    HeaderComponent,
    FormsModule,
    NgForOf
  ],
  templateUrl: './sports-facilities.component.html',
  styleUrl: './sports-facilities.component.scss'
})
export class SportsFacilitiesComponent {
  selectedCity: string = '';
  selectedType: string = '';

  cities: string[] = [];
  facilityTypes = [
    { value: 'open', label: 'Открытый' },
    { value: 'closed', label: 'Закрытый' }
  ];

  facilities: SportsFacility[] = [];
  filteredFacilities: SportsFacility[] = [];

  constructor(private router: Router) {
    this.loadMockData();
  }

  loadMockData(): void {
    this.facilities = [
      {
        id: 1,
        name: 'СК "Олимпийский"',
        type: 'closed',
        city: 'Москва',
        sport: 'Плавание',
        photo: '/assets/images/facility-1.png',
        description: 'Современный плавательный комплекс с 50-метровым бассейном',
        address: 'г. Москва, ул. Олимпийская, д. 1'
      },
      {
        id: 2,
        name: 'Стадион "Динамо"',
        type: 'open',
        city: 'Москва',
        sport: 'Лёгкая атлетика',
        photo: '/assets/images/facility-2.png',
        description: 'Многофункциональный стадион с беговыми дорожками',
        address: 'г. Москва, Ленинградский проспект, 36'
      },
      {
        id: 3,
        name: 'Ледовый дворец "Юбилейный"',
        type: 'closed',
        city: 'Санкт-Петербург',
        sport: 'Хоккей',
        photo: '/assets/images/facility-3.png',
        description: 'Крытая ледовая арена для хоккея и фигурного катания',
        address: 'г. Санкт-Петербург, пр. Добролюбова, 18'
      },
      {
        id: 4,
        name: 'Теннисный корт "Спартак"',
        type: 'outdoor',
        city: 'Казань',
        sport: 'Теннис',
        photo: '/assets/images/facility-4.png',
        description: 'Открытые корты с грунтовым покрытием',
        address: 'г. Казань, ул. Чистопольская, 77'
      },
      {
        id: 5,
        name: 'ФОК "Звёздный"',
        type: 'indoor',
        city: 'Новосибирск',
        sport: 'Баскетбол',
        photo: '/assets/images/facility-5.png',
        description: 'Физкультурно-оздоровительный комплекс с универсальным залом',
        address: 'г. Новосибирск, ул. Звёздная, 15'
      },
      {
        id: 6,
        name: 'Велотрек "Крылатское"',
        type: 'closed',
        city: 'Москва',
        sport: 'Велоспорт',
        photo: '/assets/images/facility-6.png',
        description: 'Крытый велотрек международного уровня',
        address: 'г. Москва, ул. Крылатская, 10'
      },
      {
        id: 7,
        name: 'Спортивный комплекс "Уралец"',
        type: 'closed',
        city: 'Екатеринбург',
        sport: 'Волейбол',
        photo: '/assets/images/facility-7.png',
        description: 'Многопрофильный комплекс с залами для игровых видов спорта',
        address: 'г. Екатеринбург, ул. Татищева, 91'
      },
      {
        id: 8,
        name: 'Открытый бассейн "Чайка"',
        type: 'open',
        city: 'Самара',
        sport: 'Плавание',
        photo: '/assets/images/facility-8.png',
        description: 'Открытый бассейн с подогревом воды',
        address: 'г. Самара, ул. Молодогвардейская, 200'
      },
    ];

    this.cities = Array.from(new Set(this.facilities.map(f => f.city))).sort();
    this.filteredFacilities = this.facilities;
  }

  applyFilters(): void {
    this.filteredFacilities = this.facilities.filter(facility => {
      // Фильтр по городу
      const cityMatch = !this.selectedCity || facility.city === this.selectedCity;

      // Фильтр по типу
      const typeMatch = !this.selectedType || facility.type === this.selectedType;

      return cityMatch && typeMatch;
    });
  }

  resetFilters(): void {
    this.selectedCity = '';
    this.selectedType = '';
    this.applyFilters();
  }

  getTypeLabel(type: string): string {
    const typeObj = this.facilityTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  }

  onViewDetails(id: number): void {
    // Переход на страницу конкретного объекта
    this.router.navigate(['/sports-facilities', id]);
  }
}
