import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { NgForOf, NgIf } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { API_URLS } from '../../config/api.config';

interface Athlete {
  id: number;
  fullName: string;
  avatar: string;
  sport: string;
}

interface Coach {
  id: number;
  fullName: string;
  avatar: string;
  specialization: string;
  athletes: Athlete[];
}

interface UniversityDetail {
  id: number;
  name: string;
  shortName: string;
  city: string;
  photo: string | null;
  description: string;
  totalAthletes: number;
  totalCoaches: number;
  ratingPlace: number;
  coaches: Coach[];
}

@Component({
  selector: 'app-university-detail',
  standalone: true,
  imports: [HeaderComponent, NgForOf, NgIf],
  templateUrl: './university-detail.component.html',
  styleUrl: './university-detail.component.scss'
})
export class UniversityDetailComponent implements OnInit {
  university!: UniversityDetail;
  isLoading: boolean = true;
  error: string | null = null;
  expandedCoachId: number | null = null;
  placeholderAvatar = '/assets/images/avatar-placeholder.png';
  placeholderPhoto = 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUniversity();
  }

  loadUniversity(): void {
    this.isLoading = true;
    this.error = null;

    const universityId = this.route.snapshot.paramMap.get('id');

    if (!universityId) {
      this.error = 'ID университета не указан';
      this.isLoading = false;
      return;
    }

    this.http.get<UniversityDetail>(`${API_URLS.UNIVERSITY_STATS}/${universityId}`)
      .subscribe({
        next: (data) => {
          this.university = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка загрузки данных:', err);
          this.error = 'Не удалось загрузить данные об университете';
          this.isLoading = false;
        }
      });
  }

  toggleCoach(coachId: number): void {
    if (this.expandedCoachId === coachId) {
      this.expandedCoachId = null;
    } else {
      this.expandedCoachId = coachId;
    }
  }

  onCoachClick(coachId: number): void {
    this.router.navigate(['/profile', coachId]);
  }

  onAthleteClick(athleteId: number): void {
    this.router.navigate(['/profile', athleteId]);
  }

  onBack(): void {
    this.router.navigate(['/universities']);
  }

  getAvatar(avatar: string | null): string {
    return avatar || this.placeholderAvatar;
  }

  getPhoto(photo: string | null): string {
    return photo || this.placeholderPhoto;
  }
}
