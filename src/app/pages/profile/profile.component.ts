import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderComponent} from "../header/header.component";
import {HttpClient} from "@angular/common/http";
import {API_CONFIG, API_URLS} from '../../config/api.config';
import {AuthService} from "../../services/auth.service";
import {DynamicFormComponent} from "../dynamic-form/dynamic-form.component";
import {NotificationService} from '../../services/notification.service';
import {UserProfile} from "../../models/user.model";
import {UserService} from "../../services/user.service";
import { PROFILE_EDIT_FIELDS, PROFILE_PASSWORD_FIELDS } from './profile.config';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, DynamicFormComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  readonly editFields = PROFILE_EDIT_FIELDS;
  readonly passwordFields = PROFILE_PASSWORD_FIELDS;

  user!: UserProfile;
  isLoading: boolean = true;
  error: string | null = null;
  placeholderAvatar = '/assets/images/avatar-placeholder.png';

  // --- Переменные для прав доступа и редактирования ---
  currentUserId: number | null = null;
  isAdmin: boolean = false;
  isOwnProfile: boolean = false;
  showPasswordForm: boolean = false;
  showEditForm: boolean = false;
  editData: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private notification: NotificationService
  ) {
  }

  ngOnInit(): void {
    // Подписываемся на текущего юзера, чтобы знать кто мы
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
        this.isAdmin = user.role === 'Admin';
      } else {
        this.currentUserId = null;
        this.isAdmin = false;
      }
      this.checkOwnership();
    });

    this.loadProfile();
  }

  loadProfile(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (!userId) return;

    this.userService.getProfile(userId).subscribe({
      next: (data) => {
        this.user = data;
        this.checkOwnership();
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Не удалось загрузить данные профиля';
        this.isLoading = false;
      }
    });
  }

  // Метод для определения, находимся ли мы в своем профиле
  checkOwnership(): void {
    if (this.user && this.currentUserId) {
      this.isOwnProfile = this.user.id === this.currentUserId;
    } else {
      this.isOwnProfile = false;
    }
  }

  // Открытие формы: подготавливаем данные
  openEditForm(): void {
    // Бэкенд отдает ФИО вместе, для формы мы их разделяем
    const names = this.user.fullName.split(' ');

    this.editData = {
      lastName: names[0] || '',
      firstName: names[1] || '',
      middleName: names.slice(2).join(' ') || '',
      birthDate: this.user.birthDate,
      gender: this.user.gender
    };

    this.showEditForm = true;
  }

  // Отправка данных
  onEditSubmit(formData: any): void {
    this.userService.updateProfile(this.user.id, formData).subscribe({
      next: () => {
        this.showEditForm = false;
        this.loadProfile();
        if (this.isOwnProfile) this.authService.refreshUserProfile();
      },
      error: (err) => this.notification.showError('Ошибка: ' + err.message)
    });
  }

  // ... (Остальные методы: getRoleLabel, getGenderLabel, formatDate, onLogout и т.д. остаются без изменений) ...

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        console.error('Ошибка при выходе:', err);
        this.router.navigate(['/login']);
      }
    });
  }

  onUniversityClick(): void {
    if (this.user.universityId) {
      this.router.navigate(['/university-details', this.user.universityId]); // Поправлен роут
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


  openPasswordForm(): void {
    this.showPasswordForm = true;
  }

  onPasswordSubmit(formData: any): void {
    if (formData.password !== formData.confirmPassword) {
      this.notification.showError('Пароли не совпадают!');
      return;
    }

    this.userService.changePassword(this.user.id, {
      oldPassword: formData.oldPassword,
      password: formData.password
    }).subscribe({
      next: () => {
        this.showPasswordForm = false;
        this.notification.showSuccess('Пароль изменен');
      },
      error: (err) => this.notification.showError('Ошибка смены пароля')
    });
  }

  // Метод для обработки выбора фотографии
  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.isLoading = true;
    this.userService.uploadProfilePhoto(formData).subscribe({
      next: (updatedProfile) => {
        this.user = updatedProfile;
        this.authService.refreshUserProfile();
        this.isLoading = false;
        this.notification.showSuccess('Фото изменено  ');
      },
      error: () => {
        this.notification.showError('Не удалось загрузить фото');
        this.isLoading = false;
      }
    });
  }

  handleImageError(event: any) {
    event.target.src = this.DEFAULT_AVATAR;
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

  getMemberAvatar(imageLink: string | null): string {
    if (!imageLink) return this.DEFAULT_AVATAR;
    if (imageLink.startsWith('http')) return imageLink; // Если ссылка внешняя
    return this.API_CONFIG.BASE_URL + imageLink;
  }

  onAdminPanel(): void {
    this.router.navigate(['/admin-panel']);
  }

  protected readonly API_URLS = API_URLS;
  protected readonly API_CONFIG = API_CONFIG;
  readonly DEFAULT_AVATAR = '/assets/images/avatar-placeholder.png';
}
