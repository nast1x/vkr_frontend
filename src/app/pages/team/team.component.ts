import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import { Router } from '@angular/router';
import {NgForOf} from "@angular/common";
import {HeaderComponent} from "../header/header.component";

interface TeamMember {
  id: number;
  fullName: string;
  avatar: string;
  type: 'athlete' | 'coach';
  university: string;
  city: string;
}
@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    HeaderComponent
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent {
  selectedCity: string = '';
  cities: string[] = [];
  showAthletes: boolean = true;
  showCoaches: boolean = true;
  activeTab: 'all' | 'athletes' | 'coaches' = 'all';

  members: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];

  constructor(private router: Router) {
    this.loadMockData();
  }

  loadMockData(): void {
    this.members = [
      { id: 1, fullName: 'Иванов Алексей Петрович', avatar: '/assets/images/jogging.png', type: 'athlete', university: 'МГУ им. Ломоносова', city: 'Москва' },
      { id: 2, fullName: 'Петров Сергей Владимирович', avatar: '/assets/images/avatar-placeholder.png', type: 'coach', university: 'МГУ им. Ломоносова', city: 'Москва' },
      { id: 3, fullName: 'Смирнова Анна Игоревна', avatar: '/assets/images/avatar-placeholder.png', type: 'athlete', university: 'СПбГУ', city: 'Санкт-Петербург' },
      { id: 4, fullName: 'Козлов Дмитрий Олегович', avatar: '/assets/images/avatar-placeholder.png', type: 'athlete', university: 'НГУ', city: 'Новосибирск' },
      { id: 5, fullName: 'Соколова Елена Андреевна', avatar: '/assets/images/avatar-placeholder.png', type: 'coach', university: 'КФУ', city: 'Казань' },
      { id: 6, fullName: 'Морозов Иван Сергеевич', avatar: '/assets/images/avatar-placeholder.png', type: 'athlete', university: 'УрФУ', city: 'Екатеринбург' },
      { id: 7, fullName: 'Новикова Ольга Павловна', avatar: '/assets/images/avatar-placeholder.png', type: 'athlete', university: 'ТГУ', city: 'Томск' },
      { id: 8, fullName: 'Васильев Андрей Николаевич', avatar: '/assets/images/avatar-placeholder.png', type: 'coach', university: 'ДВФУ', city: 'Владивосток' },
      { id: 9, fullName: 'Павлова Мария Александровна', avatar: '/assets/images/avatar-placeholder.png', type: 'athlete', university: 'ЮФУ', city: 'Ростов-на-Дону' },
      { id: 10, fullName: 'Фёдоров Максим Евгеньевич', avatar: '/assets/images/avatar-placeholder.png', type: 'athlete', university: 'Самарский университет', city: 'Самара' },
    ];

    this.cities = Array.from(new Set(this.members.map(m => m.city))).sort();
    this.filteredMembers = this.members;
  }

  applyFilters(): void {
    this.filteredMembers = this.members.filter(member => {
      // Фильтр по городу
      const cityMatch = !this.selectedCity || member.city === this.selectedCity;

      // Фильтр по типу (спортсмен/тренер)
      let typeMatch = true;
      if (this.activeTab === 'athletes') {
        typeMatch = member.type === 'athlete';
      } else if (this.activeTab === 'coaches') {
        typeMatch = member.type === 'coach';
      } else {
        // Режим "Все" — используем чекбоксы
        if (member.type === 'athlete' && !this.showAthletes) typeMatch = false;
        if (member.type === 'coach' && !this.showCoaches) typeMatch = false;
      }

      return cityMatch && typeMatch;
    });
  }

  setTab(tab: 'all' | 'athletes' | 'coaches'): void {
    this.activeTab = tab;

    // Синхронизируем чекбоксы с вкладками
    if (tab === 'athletes') {
      this.showAthletes = true;
      this.showCoaches = false;
    } else if (tab === 'coaches') {
      this.showAthletes = false;
      this.showCoaches = true;
    } else {
      this.showAthletes = true;
      this.showCoaches = true;
    }

    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedCity = '';
    this.showAthletes = true;
    this.showCoaches = true;
    this.activeTab = 'all';
    this.applyFilters();
  }

  onViewProfile(id: number): void {
    // Переход на страницу профиля пользователя
    this.router.navigate(['/profile', id]);
  }
}
