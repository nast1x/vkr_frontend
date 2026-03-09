import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HeaderComponent} from "../header/header.component";
import {NgForOf} from "@angular/common";

interface UniversityRanking {
  name: string;
  city: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

interface AthleteRanking {
  id: number;
  name: string;
  avatar: string;
  university: string;
  sport: string;
  medals: number;
  competitions: number;
}

interface SportStatistics {
  name: string;
  athletes: number;
  competitions: number;
  facilities: number;
  percentage: number;
}

interface CityStatistics {
  name: string;
  athletes: number;
  competitions: number;
  total: number;
}

interface Statistics {
  totalAthletes: number;
  totalCoaches: number;
  totalUniversities: number;
  totalCompetitions: number;
  topUniversities: UniversityRanking[];
  topAthletes: AthleteRanking[];
  sportsStatistics: SportStatistics[];
  cityStatistics: CityStatistics[];
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    HeaderComponent,
    NgForOf
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {
  currentDate: string;
  stats!: Statistics;

  constructor(private router: Router) {
    this.currentDate = new Date().toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    this.loadMockData();
  }

  loadMockData(): void {
    // Заглушка данных - в реальности будет агрегация из БД
    this.stats = {
      totalAthletes: 1247,
      totalCoaches: 312,
      totalUniversities: 45,
      totalCompetitions: 156,

      topUniversities: [
        { name: 'МГУ им. М.В. Ломоносова', city: 'Москва', gold: 45, silver: 32, bronze: 28, total: 105 },
        { name: 'СПбГУ', city: 'Санкт-Петербург', gold: 38, silver: 35, bronze: 30, total: 103 },
        { name: 'МГТУ им. Баумана', city: 'Москва', gold: 35, silver: 28, bronze: 25, total: 88 },
        { name: 'НГУ', city: 'Новосибирск', gold: 28, silver: 24, bronze: 22, total: 74 },
        { name: 'КФУ', city: 'Казань', gold: 25, silver: 26, bronze: 24, total: 75 },
      ],

      topAthletes: [
        {
          id: 1,
          name: 'Иванов Алексей Петрович',
          avatar: '/assets/images/avatar-placeholder.png',
          university: 'МГУ им. Ломоносова',
          sport: 'Плавание',
          medals: 18,
          competitions: 24
        },
        {
          id: 2,
          name: 'Петров Сергей Владимирович',
          avatar: '/assets/images/avatar-placeholder.png',
          university: 'МГТУ им. Баумана',
          sport: 'Лёгкая атлетика',
          medals: 15,
          competitions: 22
        },
        {
          id: 3,
          name: 'Смирнова Анна Игоревна',
          avatar: '/assets/images/avatar-placeholder.png',
          university: 'СПбГУ',
          sport: 'Плавание',
          medals: 14,
          competitions: 20
        },
        {
          id: 4,
          name: 'Козлов Дмитрий Олегович',
          avatar: '/assets/images/avatar-placeholder.png',
          university: 'НГУ',
          sport: 'Баскетбол',
          medals: 12,
          competitions: 18
        },
        {
          id: 5,
          name: 'Соколова Елена Андреевна',
          avatar: '/assets/images/avatar-placeholder.png',
          university: 'КФУ',
          sport: 'Гимнастика',
          medals: 11,
          competitions: 16
        },
      ],

      sportsStatistics: [
        { name: 'Плавание', athletes: 320, competitions: 45, facilities: 28, percentage: 85 },
        { name: 'Лёгкая атлетика', athletes: 285, competitions: 38, facilities: 35, percentage: 75 },
        { name: 'Баскетбол', athletes: 210, competitions: 32, facilities: 22, percentage: 60 },
        { name: 'Волейбол', athletes: 180, competitions: 28, facilities: 20, percentage: 50 },
        { name: 'Гимнастика', athletes: 150, competitions: 22, facilities: 15, percentage: 40 },
        { name: 'Теннис', athletes: 102, competitions: 18, facilities: 18, percentage: 30 },
      ],

      cityStatistics: [
        { name: 'Москва', athletes: 425, competitions: 52, total: 477 },
        { name: 'Санкт-Петербург', athletes: 312, competitions: 38, total: 350 },
        { name: 'Казань', athletes: 185, competitions: 24, total: 209 },
        { name: 'Новосибирск', athletes: 156, competitions: 18, total: 174 },
        { name: 'Екатеринбург', athletes: 142, competitions: 16, total: 158 },
        { name: 'Самара', athletes: 127, competitions: 14, total: 141 },
      ]
    };
  }

  onAthleteClick(athleteId: number): void {
    this.router.navigate(['/profile', athleteId]);
  }
}
