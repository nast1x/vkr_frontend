import { Component } from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
interface Competition {
  id: number;
  name: string;
  date: string;
}

interface Record {
  athleteId: number;
  athleteName: string;
  athleteAvatar: string;
  university: string;
  discipline: string;
  result: string;
  date: string;
}

interface SportsFacility {
  id: number;
  name: string;
  type: 'open' | 'closed' | 'indoor' | 'outdoor';
  typeDescription: string;
  usage: 'training' | 'competitions' | 'both';
  usageDescription: string;
  city: string;
  sport: string;
  sportsList: string[];
  photo: string;
  description: string;
  address: string;
  competitions: Competition[];
  records: Record[];
}
@Component({
  selector: 'app-sports-facilities-detail',
  standalone: true,
  imports: [
    HeaderComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './sports-facilities-detail.component.html',
  styleUrl: './sports-facilities-detail.component.scss'
})
export class SportsFacilitiesDetailComponent {
  facility!: SportsFacility;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loadMockData();
  }

  loadMockData(): void {
    const facilityId = this.route.snapshot.paramMap.get('id');
    console.log('Loading facility:', facilityId);

    // Заглушка данных
    this.facility = {
      id: 1,
      name: 'СК "Олимпийский"',
      type: 'closed',
      typeDescription: 'Крытое помещение с климат-контролем',
      usage: 'both',
      usageDescription: 'Проводятся как тренировки, так и соревнования',
      city: 'Москва',
      sport: 'Плавание',
      sportsList: ['Плавание', 'Водное поло', 'Синхронное плавание', 'Прыжки в воду'],
      photo: '/assets/images/facility-1.png',
      description: 'Современный плавательный комплекс с 50-метровым бассейном на 8 дорожек. Оборудован системой электронного хронометража и трибунами на 500 мест. Соответствует всем международным стандартам для проведения соревнований любого уровня.',
      address: 'г. Москва, ул. Олимпийская, д. 1',
      competitions: [
        { id: 1, name: 'Чемпионат города по плаванию 2024', date: '15-17.03.2024' },
        { id: 2, name: 'Кубок вузов по плаванию', date: '10-12.02.2024' },
        { id: 3, name: 'Первенство Москвы среди юниоров', date: '20-22.01.2024' },
      ],
      records: [
        {
          athleteId: 1,
          athleteName: 'Иванов Алексей Петрович',
          athleteAvatar: '/assets/images/avatar-placeholder.png',
          university: 'МГУ им. Ломоносова',
          discipline: '50м вольный стиль',
          result: '25,8 с',
          date: '15.03.2024'
        },
        {
          athleteId: 2,
          athleteName: 'Петров Сергей Владимирович',
          athleteAvatar: '/assets/images/avatar-placeholder.png',
          university: 'МГТУ им. Баумана',
          discipline: '100м вольный стиль',
          result: '56,3 с',
          date: '15.03.2024'
        },
        {
          athleteId: 3,
          athleteName: 'Смирнов Дмитрий Олегович',
          athleteAvatar: '/assets/images/avatar-placeholder.png',
          university: 'СПбГУ',
          discipline: '200м брасс',
          result: '2:15,4 мин',
          date: '16.03.2024'
        },
        {
          athleteId: 4,
          athleteName: 'Козлов Андрей Николаевич',
          athleteAvatar: '/assets/images/avatar-placeholder.png',
          university: 'НГУ',
          discipline: '100м на спине',
          result: '1:02,5 мин',
          date: '17.03.2024'
        },
      ]
    };
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'open': 'Открытый',
      'closed': 'Закрытый',
      'indoor': 'Крытый',
      'outdoor': 'Открытый корт'
    };
    return labels[type] || type;
  }

  getUsageLabel(usage: string): string {
    const labels: { [key: string]: string } = {
      'training': 'Тренировки',
      'competitions': 'Соревнования',
      'both': 'Тренировки и соревнования'
    };
    return labels[usage] || usage;
  }

  onCompetitionClick(competitionId: number): void {
    this.router.navigate(['/competitions', competitionId]);
  }

  onAthleteClick(athleteId: number): void {
    this.router.navigate(['/profile', athleteId]);
  }
}
