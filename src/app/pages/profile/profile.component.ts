import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderComponent} from "../header/header.component";
import {HttpClient} from "@angular/common/http";
import {API_CONFIG, API_URLS} from '../../config/api.config';
import {AuthService} from "../../services/auth.service";
import {DynamicFormComponent, FormField} from "../dynamic-form/dynamic-form.component";
import {NotificationService} from '../../services/notification.service';

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

interface UserSport {
  sportName: string;
  rankName: string;
  dateReceived: Date;
}

interface UserProfile {
  id: number;
  fullName: string;
  avatar: string;
  role: 'Athlete' | 'Coach' | 'Admin'; // Добавили Admin
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
  sport: UserSport[];
  records: Record[];
  trainees: Trainee[];
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, DynamicFormComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
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

  editFields: FormField[] = [
    {name: 'lastName', label: 'Фамилия', type: 'text', required: true},
    {name: 'firstName', label: 'Имя', type: 'text', required: true},
    {name: 'middleName', label: 'Отчество', type: 'text'},
    {name: 'birthDate', label: 'Дата рождения', type: 'date'},
    {
      name: 'gender', label: 'Пол', type: 'select', required: true, options: [
        {value: 'Male', label: 'Мужской'},
        {value: 'Female', label: 'Женский'}
      ]
    }
  ];

  passwordFields: FormField[] = [
    {name: 'oldPassword', label: 'Текущий пароль', type: 'password', required: true},
    {name: 'password', label: 'Новый пароль', type: 'password', required: true},
    {name: 'confirmPassword', label: 'Повторите новый пароль', type: 'password', required: true}
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
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
          this.checkOwnership(); // Проверяем права после загрузки профиля
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка загрузки данных:', err);
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
    // В API_URLS у нас нет прямого роута на /api/users, поэтому сформируем его:
    const updateUrl = `${API_CONFIG.BASE_URL}/api/users/${this.user.id}`;

    this.http.put(updateUrl, formData).subscribe({
      next: () => {
        this.showEditForm = false;
        this.loadProfile(); // Обновляем данные на странице

        // Если пользователь отредактировал сам себя, обновляем глобальное состояние (шапку и т.д.)
        if (this.isOwnProfile) {
          this.authService.refreshUserProfile();
        }
      },
      error: (err) => {
        this.notification.showError('Ошибка при сохранении: ' + err.message);
      }
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
    // 1. Проверяем, совпадают ли новые пароли
    if (formData.password !== formData.confirmPassword) {
      this.notification.showError('Новые пароли не совпадают!')
      return;
    }

    // 2. Формируем URL
    const updateUrl = `${API_CONFIG.BASE_URL}/api/users/${this.user.id}`;

    // 3. Собираем полезную нагрузку (confirmPassword на бэк не отправляем)
    const payload = {
      oldPassword: formData.oldPassword,
      password: formData.password
    };

    this.http.put(updateUrl, payload).subscribe({
      next: () => {
        this.showPasswordForm = false;
        this.notification.showSuccess('Пароль успешно изменен!');
      },
      error: (err) => {
        // Если бэкенд выбросил ошибку (например, неверный старый пароль)
        const errorMsg = err.error?.message || 'Ошибка при смене пароля. Проверьте текущий пароль.';
        this.notification.showError(errorMsg)
      }
    });
  }

  // Метод для обработки выбора фотографии
  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;


    const formData = new FormData();
    formData.append('file', file);

    this.isLoading = true;

    // Используем withCredentials: true, так как бэкенд читает токен из куки
    this.http.post<UserProfile>(`${API_CONFIG.BASE_URL}/api/users/profile/photo`, formData, {withCredentials: true})
      .subscribe({
        next: (updatedProfile) => {
          this.user = updatedProfile; // Бэкенд возвращает обновленный профиль, сразу обновляем UI

          // Обновляем состояние в AuthService, чтобы аватарка поменялась и в шапке сайта (header)
          this.authService.refreshUserProfile();

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка при загрузке фото:', err);
          this.notification.showError('Не удалось загрузить фотографию.');
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
