import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HeaderComponent} from "../header/header.component";
import {PageDecorComponent} from "../../shared/components/page-decor/page-decor.component";
import {Statistics} from "../../models/statistics.model";
import {StatisticsService} from "../../services/statistics.service";
import {NotificationService} from "../../services/notification.service";
import {NgOptimizedImage} from "@angular/common";


@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [HeaderComponent, PageDecorComponent, NgOptimizedImage],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  private router = inject(Router);
  private statisticsService = inject(StatisticsService);
  private notification = inject(NotificationService)

  stats!: Statistics;
  isLoading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;
    this.error = null;

    this.statisticsService.getStatistics().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки данных:', err);
        this.notification.showError('Ошибка загрузки данных:' + err)
        this.error = 'Не удалось загрузить данные. Проверьте подключение к серверу.';
        this.isLoading = false;
      }
    });
  }

  onAthleteClick(athleteId: number): void {
    this.router.navigate(['/profile', athleteId]);
  }

  onUniversityClick(universityId: number): void {
    this.router.navigate(['/universities-details', universityId]);
  }
}
