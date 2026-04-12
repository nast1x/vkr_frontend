import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { API_CONFIG, API_URLS } from '../../config/api.config';
import {LoaderComponent} from "../../shared/components/loader/loader.component";
import {ErrorStateComponent} from "../../shared/components/error-state/error-state.component";
import {PageDecorComponent} from "../../shared/components/page-decor/page-decor.component";

interface Achievement {
  idAchievement: number;
  userId: number;
  userName: string;
  userRole: string;
  avatar?: string | null;
  sportRankName: string;
  sportTypeName: string;
  dateReceived: string;
}

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule, NgOptimizedImage, LoaderComponent, ErrorStateComponent, PageDecorComponent],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss'
})
export class AchievementsComponent implements OnInit {
  achievements: Achievement[] = [];
  filteredAchievements: Achievement[] = [];

  isLoading = true;
  error: string | null = null;
  protected readonly API_CONFIG = API_CONFIG;
  readonly DEFAULT_AVATAR = '/assets/images/avatar-placeholder.png';

  selectedRole: string = '';
  selectedSport: string = '';
  selectedRank: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadAchievements();
  }

  loadAchievements(): void {
    this.isLoading = true;
    this.error = null;
    this.http.get<Achievement[]>(API_URLS.ACHIEVEMENT).subscribe({
      next: (data) => {
        this.achievements = data;
        this.filteredAchievements = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки достижений:', err);
        this.error = 'Не удалось загрузить список достижений';
        this.isLoading = false;
      }
    });
  }

  get uniqueSports(): string[] {
    return Array.from(new Set(this.achievements.map(a => a.sportTypeName))).filter(Boolean).sort();
  }

  get uniqueRanks(): string[] {
    return Array.from(new Set(this.achievements.map(a => a.sportRankName))).filter(Boolean).sort();
  }

  applyFilters(): void {
    this.filteredAchievements = this.achievements.filter(ach => {
      const roleMatch = !this.selectedRole || ach.userRole === this.selectedRole;
      const sportMatch = !this.selectedSport || ach.sportTypeName === this.selectedSport;
      const rankMatch = !this.selectedRank || ach.sportRankName === this.selectedRank;

      return roleMatch && sportMatch && rankMatch;
    });
  }

  resetFilters(): void {
    this.selectedRole = '';
    this.selectedSport = '';
    this.selectedRank = '';
    this.applyFilters();
  }

  openDetails(id: number): void {
    this.router.navigate(['/profile', id]);
  }

  getRoleLabel(role: string): string {
    const roles: Record<string, string> = {
      'Athlete': 'Спортсмен',
      'Coach': 'Тренер',
      'Admin': 'Администратор'
    };
    return roles[role] || role;
  }

  handleImageError(event: any) {
    event.target.src = this.DEFAULT_AVATAR;
  }

  // Метод для формирования URL аватарки (как в компоненте команды)
  getMemberAvatar(avatar: string | null | undefined): string {
    if (!avatar) {
      return this.DEFAULT_AVATAR;
    }
    return this.API_CONFIG.BASE_URL + avatar;
  }
}
