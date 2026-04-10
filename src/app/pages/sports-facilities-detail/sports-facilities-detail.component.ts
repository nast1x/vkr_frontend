    import { Component, OnInit } from '@angular/core';
    import { HeaderComponent } from "../header/header.component";
    
    import { ActivatedRoute, Router } from "@angular/router";
    import { HttpClient } from "@angular/common/http";
    import { API_URLS } from '../../config/api.config';

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
      city: string;
      address: string;
      photo: string;
      description: string;
      sportsList: string[];
      competitions: Competition[];
      records: Record[];
    }

    @Component({
      selector: 'app-sports-facilities-detail',
      standalone: true,
      imports: [HeaderComponent],
      templateUrl: './sports-facilities-detail.component.html',
      styleUrl: './sports-facilities-detail.component.scss'
    })
    export class SportsFacilitiesDetailComponent implements OnInit {
      facility!: SportsFacility;
      isLoading: boolean = true;
      error: string | null = null;

      constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient
      ) {}

      ngOnInit(): void {
        this.loadFacility();
      }

      loadFacility(): void {
        this.isLoading = true;
        this.error = null;

        const facilityId = this.route.snapshot.paramMap.get('id');

        if (!facilityId) {
          this.error = 'ID объекта не указан';
          this.isLoading = false;
          return;
        }

        this.http.get<SportsFacility>(`${API_URLS.SPORT_FACILITIES}/${facilityId}`)
          .subscribe({
            next: (data) => {
              this.facility = data;
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Ошибка загрузки данных:', err);
              this.error = 'Не удалось загрузить данные об объекте';
              this.isLoading = false;
            }
          });
      }

      onCompetitionClick(competitionId: number): void {
        this.router.navigate(['/competition-details', competitionId]);
      }

      onAthleteClick(athleteId: number): void {
        this.router.navigate(['/profile', athleteId]);
      }

      onBack(): void {
        this.router.navigate(['/sports-facilities']);
      }
    }
