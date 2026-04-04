import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderComponent} from "../header/header.component";
import {NgForOf, NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {API_CONFIG, API_URLS} from '../../config/api.config';
import {AuthService} from "../../services/auth.service";

interface Record {
  competitionId: number;
  competitionName: string;
  date: string;
  discipline: string;
  result: string;
}

interface Trainee {
  id: number;
  fullName: string;
  avatar: string;
  sport: string;
}

interface UserProfile {
  id: number;
  fullName: string;
  avatar: string;
  role: 'Athlete' | 'Coach';
  age: number;
  birthDate: string;
  gender: 'Male' | 'Female';
  email: string;
  university: string;
  universityId: number;
  faculty: string;
  course: number;
  coachId: number | null;
  coachName: string | null;
  sport: string | null;
  category: string | null;
  records: Record[];
  trainees: Trainee[];
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, NgForOf, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user!: UserProfile;
  isLoading: boolean = true;
  error: string | null = null;
  placeholderAvatar = '/assets/images/avatar-placeholder.png';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.error = null;

    const userId = this.route.snapshot.paramMap.get('id');

    if (!userId) {
      this.error = 'ID пользователя не указан';
      this.isLoading = false;
      return;
    }

    this.http.get<UserProfile>(`${API_URLS.PROFILE}/${userId}`)
      .subscribe({
        next: (data) => {
          this.user = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка загрузки данных:', err);
          this.error = 'Не удалось загрузить данные профиля';
          this.isLoading = false;
        }
      });
  }

  getRoleLabel(role: string): string {
    if (role === 'Athlete') {
      return 'Спортсмен';
    } else if (role === 'Coach') {
      return 'Тренер';
    } else {
      return 'Пользователь';
    }
  }

  getGenderLabel(gender: string): string {
    return gender === 'Male' ? 'Мужской' : 'Женский';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  onEdit(): void {
    console.log('Редактировать профиль');
    // Логика редактирования
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // После успешного выхода — редирект на страницу входа
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Ошибка при выходе:', err);
        // Всё равно редиректим, даже если ошибка
        this.router.navigate(['/login']);
      }
    });
  }

  onUniversityClick(): void {
    if (this.user.universityId) {
      this.router.navigate(['/universities-details', this.user.universityId]);
    }
  }

  onCompetitionClick(competitionId: number): void {
    this.router.navigate(['/competition-details', competitionId]);
  }

  onTraineeClick(traineeId: number): void {
    this.router.navigate(['/profile', traineeId]);
  }

  onBack(): void {
    window.history.back();
  }
  // Метод для обработки ошибки
  handleImageError(event: any) {
    event.target.src = this.DEFAULT_AVATAR;
  }

// Метод для формирования URL
  getMemberAvatar(imageLink: string | null): string {
    if (!imageLink) {
      return this.DEFAULT_AVATAR;
    }
    return this.API_CONFIG.BASE_URL + imageLink;
  }

  protected readonly API_URLS = API_URLS;
  protected readonly API_CONFIG = API_CONFIG;
  readonly DEFAULT_AVATAR = '/assets/images/avatar-placeholder.png';
}
