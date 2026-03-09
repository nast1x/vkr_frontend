import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HeaderComponent} from "../header/header.component";
import {NgForOf, NgIf} from "@angular/common";

interface FavoriteAthlete {
  id: number;
  name: string;
  avatar: string;
  university: string;
  sport: string;
}

interface FavoriteCompetition {
  id: number;
  name: string;
  city: string;
  date: string;
}

interface FavoriteFacility {
  id: number;
  name: string;
  city: string;
  sport: string;
  photo: string;
}

interface Favorites {
  athletes: FavoriteAthlete[];
  competitions: FavoriteCompetition[];
  facilities: FavoriteFacility[];
}
@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [
    HeaderComponent,
    NgIf,
    NgForOf
  ],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent {
  activeTab: 'all' | 'athletes' | 'competitions' | 'facilities' = 'all';
  favorites!: Favorites;

  constructor(private router: Router) {
    this.loadMockData();
  }

  loadMockData(): void {
    // Заглушка данных - в реальности будет загрузка из БД по userId
    this.favorites = {
      athletes: [
        {
          id: 1,
          name: 'Иванов Алексей Петрович',
          avatar: '/assets/images/avatar-placeholder.png',
          university: 'МГУ им. Ломоносова',
          sport: 'Плавание'
        },
        {
          id: 2,
          name: 'Петров Сергей Владимирович',
          avatar: '/assets/images/avatar-placeholder.png',
          university: 'МГТУ им. Баумана',
          sport: 'Лёгкая атлетика'
        },
        {
          id: 3,
          name: 'Смирнова Анна Игоревна',
          avatar: '/assets/images/avatar-placeholder.png',
          university: 'СПбГУ',
          sport: 'Плавание'
        },
      ],
      competitions: [
        {
          id: 1,
          name: 'Чемпионат города по плаванию 2024',
          city: 'Москва',
          date: '15-17.03.2024'
        },
        {
          id: 2,
          name: 'Вузовская спартакиада',
          city: 'Санкт-Петербург',
          date: '01-05.04.2024'
        },
      ],
      facilities: [
        {
          id: 1,
          name: 'СК "Олимпийский"',
          city: 'Москва',
          sport: 'Плавание',
          photo: '/assets/images/facility-1.png'
        },
        {
          id: 2,
          name: 'Стадион "Динамо"',
          city: 'Москва',
          sport: 'Лёгкая атлетика',
          photo: '/assets/images/facility-2.png'
        },
        {
          id: 3,
          name: 'Ледовый дворец "Юбилейный"',
          city: 'Санкт-Петербург',
          sport: 'Хоккей',
          photo: '/assets/images/facility-3.png'
        },
      ]
    };
  }

  setTab(tab: 'all' | 'athletes' | 'competitions' | 'facilities'): void {
    this.activeTab = tab;
  }

  removeFavorite(type: 'athlete' | 'competition' | 'facility', id: number): void {
    // В реальности будет API запрос на удаление из избранного
    console.log(`Remove ${type} ${id} from favorites`);

    if (type === 'athlete') {
      this.favorites.athletes = this.favorites.athletes.filter(a => a.id !== id);
    } else if (type === 'competition') {
      this.favorites.competitions = this.favorites.competitions.filter(c => c.id !== id);
    } else if (type === 'facility') {
      this.favorites.facilities = this.favorites.facilities.filter(f => f.id !== id);
    }
  }

  onAthleteClick(athleteId: number): void {
    this.router.navigate(['/profile', athleteId]);
  }

  onCompetitionClick(competitionId: number): void {
    this.router.navigate(['/competitions', competitionId]);
  }

  onFacilityClick(facilityId: number): void {
    this.router.navigate(['/sports-facilities', facilityId]);
  }
}
