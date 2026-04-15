import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderComponent} from "../header/header.component";
import {Competition} from "../../models/competition.model";
import {CompetitionService} from "../../services/competition.service";
import {COMPETITION_LEVEL_LABELS, COMPETITION_STATUS_LABELS} from "../../config/app.constants";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-competition-details',
  standalone: true,
  imports: [HeaderComponent, NgOptimizedImage],
  templateUrl: './competition-details.component.html',
  styleUrl: './competition-details.component.scss'
})
export class CompetitionDetailsComponent implements OnInit {
  private competitionService = inject(CompetitionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  competition!: Competition;

  isLoading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCompetition();
    } else {
      this.error = 'ID соревнования не указан';
      this.isLoading = false;
    }
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

    this.competitionService.getCompetitionById(competitionId).subscribe({
      next: (data) => {
        this.competition = data;
        this.isLoading = false;
      },
      error: () => {
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
    return COMPETITION_STATUS_LABELS[status] || status;
  }

  getLevelLabel(level: string): string {
    return COMPETITION_LEVEL_LABELS[level] || level;
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
