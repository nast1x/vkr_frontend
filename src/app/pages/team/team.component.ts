import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';

import { HeaderComponent } from "../header/header.component";
import { HttpClient } from "@angular/common/http";
import {API_CONFIG, API_URLS} from '../../config/api.config';

interface TeamMember {
  userId: number;
  fullName: string;
  universityName: string;
  universityCity: string;
  roleName: 'Athlete' | 'Coach';
  imageLink: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [FormsModule, HeaderComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent implements OnInit {
  readonly DEFAULT_AVATAR = '/assets/images/avatar-placeholder.png';
  selectedCity: string = '';
  cities: string[] = [];
  showAthletes: boolean = true;
  showCoaches: boolean = true;
  activeTab: 'all' | 'athletes' | 'coaches' = 'all';
  members: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadTeamData();
  }

// Загрузка данных с бэкенда
  loadTeamData(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<TeamMember[]>(API_URLS.TEAM)
      .subscribe({
        next: (data) => {
          this.members = data;
          this.cities = Array.from(new Set(this.members.map(m => m.universityCity))).sort();
          this.filteredMembers = this.members;
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
    this.filteredMembers = this.members.filter(member => {
      const cityMatch = !this.selectedCity || member.universityCity === this.selectedCity;

      let typeMatch = true;
      if (this.activeTab === 'athletes') {
        typeMatch = member.roleName === 'Athlete';
      } else if (this.activeTab === 'coaches') {
        typeMatch = member.roleName === 'Coach';
      } else {
        if (member.roleName === 'Athlete' && !this.showAthletes) typeMatch = false;
        if (member.roleName === 'Coach' && !this.showCoaches) typeMatch = false;
      }

      return cityMatch && typeMatch;
    });
  }

  setTab(tab: 'all' | 'athletes' | 'coaches'): void {
    this.activeTab = tab;
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
    this.router.navigate(['/profile', id]);
  }

// Метод для обработки ошибки
  handleImageError(event: any) {
    event.target.src = this.DEFAULT_AVATAR;
  }

// Метод для формирования URL
  getMemberAvatar(imageLink: string | null): string {
    if (!imageLink) {
      return this.DEFAULT_AVATAR;
    }
    return this.API_CONFIG.BASE_URL + imageLink;
  }

  protected readonly API_CONFIG = API_CONFIG;
}
