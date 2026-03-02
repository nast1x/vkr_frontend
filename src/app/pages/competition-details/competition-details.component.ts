import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {HeaderComponent} from "../header/header.component";
import {NgForOf} from "@angular/common";

interface Venue {
  name: string;
  address: string;
  photo: string;
}

interface BestResult {
  athleteId: number;
  athleteName: string;
  athleteAvatar: string;
  university: string;
  result: string;
}

interface ProtocolEntry {
  athleteId: number;
  athleteName: string;
  university: string;
  result: string;
}

interface Protocol {
  discipline: string;
  type: string;
  results: ProtocolEntry[];
}

interface Competition {
  id: number;
  name: string;
  city: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  venue: Venue;
  sport: string;
  category: string;
  type: 'university' | 'city' | 'regional' | 'russian';
  organizer: string;
  bestResults: BestResult[];
  protocols: Protocol[];
}
@Component({
  selector: 'app-competition-details',
  standalone: true,
  imports: [
    HeaderComponent,
    NgForOf
  ],
  templateUrl: './competition-details.component.html',
  styleUrl: './competition-details.component.scss'
})
export class CompetitionDetailsComponent {
  competition: Competition = {} as Competition;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loadMockData();
  }

  loadMockData(): void {
    const competitionId = this.route.snapshot.paramMap.get('id');
    console.log('Loading competition:', competitionId);

    // Заглушка данных
    this.competition = {
      id: 1,
      name: 'Чемпионат города по плаванию 2024',
      city: 'Москва',
      startDate: '15.03.2024',
      endDate: '17.03.2024',
      status: 'completed',
      venue: {
        name: 'СК "Олимпийский"',
        address: 'г. Москва, ул. Олимпийская, д. 1',
        photo: '/assets/images/venue-placeholder.png'
      },
      sport: 'Плавание',
      category: 'Стандартная программа',
      type: 'city',
      organizer: 'Департамент спорта г. Москвы',
      bestResults: [
        { athleteId: 1, athleteName: 'Иванов Алексей Петрович', athleteAvatar: '/assets/images/avatar-placeholder.png', university: 'МГУ им. Ломоносова', result: '25,8 с' },
        { athleteId: 2, athleteName: 'Петров Сергей Владимирович', athleteAvatar: '/assets/images/avatar-placeholder.png', university: 'МГТУ им. Баумана', result: '26,1 с' },
        { athleteId: 3, athleteName: 'Смирнов Дмитрий Олегович', athleteAvatar: '/assets/images/avatar-placeholder.png', university: 'СПбГУ', result: '26,5 с' },
      ],
      protocols: [
        {
          discipline: 'Бег 60м',
          type: 'Мужчины',
          results: [
            { athleteId: 1, athleteName: 'Иванов Алексей Петрович', university: 'МГУ им. Ломоносова', result: '7,2 с' },
            { athleteId: 2, athleteName: 'Петров Сергей Владимирович', university: 'МГТУ им. Баумана', result: '7,4 с' },
            { athleteId: 3, athleteName: 'Смирнов Дмитрий Олегович', university: 'СПбГУ', result: '7,5 с' },
            { athleteId: 4, athleteName: 'Козлов Андрей Николаевич', university: 'НГУ', result: '7,7 с' },
            { athleteId: 5, athleteName: 'Морозов Иван Сергеевич', university: 'УрФУ', result: '7,9 с' },
          ]
        },
        {
          discipline: 'Бег 100м',
          type: 'Мужчины',
          results: [
            { athleteId: 1, athleteName: 'Иванов Алексей Петрович', university: 'МГУ им. Ломоносова', result: '11,2 с' },
            { athleteId: 6, athleteName: 'Васильев Максим Евгеньевич', university: 'КФУ', result: '11,5 с' },
            { athleteId: 7, athleteName: 'Фёдоров Павел Александрович', university: 'ТГУ', result: '11,7 с' },
          ]
        },
        {
          discipline: 'Плавание 50м вольный стиль',
          type: 'Мужчины',
          results: [
            { athleteId: 1, athleteName: 'Иванов Алексей Петрович', university: 'МГУ им. Ломоносова', result: '25,8 с' },
            { athleteId: 2, athleteName: 'Петров Сергей Владимирович', university: 'МГТУ им. Баумана', result: '26,1 с' },
            { athleteId: 3, athleteName: 'Смирнов Дмитрий Олегович', university: 'СПбГУ', result: '26,5 с' },
          ]
        },
        {
          discipline: 'Плавание 100м вольный стиль',
          type: 'Женщины',
          results: [
            { athleteId: 8, athleteName: 'Смирнова Анна Игоревна', university: 'СПбГУ', result: '58,3 с' },
            { athleteId: 9, athleteName: 'Соколова Елена Андреевна', university: 'КФУ', result: '59,1 с' },
            { athleteId: 10, athleteName: 'Новикова Ольга Павловна', university: 'ТГУ', result: '59,8 с' },
          ]
        },
      ]
    };
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'upcoming': 'Ожидаемое',
      'ongoing': 'Текущее',
      'completed': 'Завершено'
    };
    return labels[status] || status;
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'university': 'Вузовские',
      'city': 'Городские',
      'regional': 'Региональные',
      'russian': 'Российские'
    };
    return labels[type] || type;
  }

  onVenueClick(): void {
    // Переход на страницу места проведения (если будет)
    console.log('Venue clicked:', this.competition.venue.name);
    // this.router.navigate(['/venues', this.competition.venue.id]);
  }

  onAthleteClick(athleteId: number): void {
    // Переход на профиль спортсмена
    this.router.navigate(['/profile', athleteId]);
  }
}
