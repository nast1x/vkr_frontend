import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from "../header/header.component";

import { HttpClient } from "@angular/common/http";
import { API_URLS } from '../../config/api.config';

interface Venue {
  id: number;
  name: string;
  address: string;
  photo: string;
}

interface BestResult {
  athleteId: number;
  athleteName: string;
  athleteAvatar: string;
  university: string;
  discipline: string;
  result: string;
}

interface ProtocolEntry {
  athleteId: number;
  athleteName: string;
  university: string;
  result: string;
  rankPlace: number;
}

interface Protocol {
  discipline: string;
  type: string;
  results: ProtocolEntry[];
}

interface Competition {
  idCompetition: number;
  name: string;
  city: string;
  startDate: string;
  endDate: string | null;
  competitionLevel: string;
  sportType: string;
  venue: Venue;
  organizer: string;
  bestResults: BestResult[];
  protocols: Protocol[];
}

@Component({
  selector: 'app-competition-details',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './competition-details.component.html',
  styleUrl: './competition-details.component.scss'
})
export class CompetitionDetailsComponent implements OnInit {
  competition!: Competition;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCompetition();
  }

  loadCompetition(): void {
    this.isLoading = true;
    this.error = null;

    const competitionId = this.route.snapshot.paramMap.get('id');

    if (!competitionId) {
      this.error = 'ID соревнования не указан';
      this.isLoading = false;
      return;
    }

    this.http.get<Competition>(`${API_URLS.COMPETITIONS}/${competitionId}`)
      .subscribe({
        next: (data) => {
          this.competition = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка загрузки данных:', err);
          this.error = 'Не удалось загрузить данные о соревновании';
          this.isLoading = false;
        }
      });
  }

  getStatusValue(): 'upcoming' | 'ongoing' | 'completed' {
    const today = new Date();
    const startDate = new Date(this.competition.startDate);
    const endDate = this.competition.endDate ? new Date(this.competition.endDate) : null;

    if (endDate && endDate < today) {
      return 'completed';
    } else if (startDate <= today && (!endDate || endDate >= today)) {
      return 'ongoing';
    } else {
      return 'upcoming';
    }
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
      'All-Russian Level': 'Российские',
      'International Level': 'Международные'
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

  onVenueClick(id: number): void {
    this.router.navigate(['/sports-facilities-detail', id]);
  }

  onAthleteClick(athleteId: number): void {
    this.router.navigate(['/profile', athleteId]);
  }

  onBack(): void {
    this.router.navigate(['/competitions']);
  }
}
