import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderComponent} from "../header/header.component";
import {API_CONFIG, API_URLS} from '../../config/api.config';
import {AuthService} from "../../services/auth.service";
import {DynamicFormComponent} from "../dynamic-form/dynamic-form.component";
import {NotificationService} from '../../services/notification.service';
import {PasswordChangeDto, ProfileUpdateDto, SportRankAssignmentDto, UserProfile} from "../../models/user.model";
import {UserService} from "../../services/user.service";
import {PROFILE_EDIT_FIELDS, PROFILE_PASSWORD_FIELDS, RANK_ASSIGNMENT_FIELDS} from './profile.config';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {GENDER_LABELS, ROLE_LABELS} from "../../config/app.constants";
import {forkJoin, switchMap} from "rxjs";
import {NgOptimizedImage} from "@angular/common";
import {filter, map} from "rxjs/operators";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, DynamicFormComponent, NgOptimizedImage],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notification = inject(NotificationService);

  readonly editFields = PROFILE_EDIT_FIELDS;
  readonly passwordFields = PROFILE_PASSWORD_FIELDS;
  rankFields = JSON.parse(JSON.stringify(RANK_ASSIGNMENT_FIELDS));

  user!: UserProfile;
  isLoading: boolean = true;
  error: string | null = null;


  editData: Partial<ProfileUpdateDto> = {};
  showEditForm = false;
  showPasswordForm = false;
  showRankForm = false;

  currentUserId: number | null = null;
  isAdmin = false;
  isOwnProfile = false;


  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        if (user) {
          this.currentUserId = user.id;
          this.isAdmin = user.role === 'Admin';
        } else {
          this.currentUserId = null;
          this.isAdmin = false;
        }
        this.checkOwnership();
      });

    this.route.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef),
      map(params => params.get('id')),
      filter(id => !!id),
      switchMap(id => this.userService.getProfile(id!))
    ).subscribe({
      next: (data) => {
        this.user = data;
        this.checkOwnership();
        this.isLoading = false;
      },
      error: () => {  }
    });
  }
  openRankForm(): void {
    forkJoin({
      sports: this.userService.getSportTypes(),
      ranks: this.userService.getSportRanks()
    }).subscribe({
      next: (result) => {

        const sportField = this.rankFields.find((f: any) => f.name === 'sportTypeId');
        if (sportField) {

          sportField.options = result.sports.map((s: any) => ({
            value: s.idSportType,
            label: s.name
          }));
        }

        const rankField = this.rankFields.find((f: any) => f.name === 'rankId');
        if (rankField) {

          rankField.options = result.ranks.map((r: any) => ({
            value: r.idSportRank,
            label: r.name
          }));
        }


        this.rankFields = [...this.rankFields];
        this.isLoading = false;
        this.showRankForm = true;
      },
      error: (err) => {
        console.error('Ошибка при загрузке справочников:', err);
      }
    });
  }

  loadProfile(id?: string | null): void {
    const userId = id || this.route.snapshot.paramMap.get('id');
    if (!userId) return;

    this.isLoading = true;
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


  checkOwnership(): void {
    if (this.user && this.currentUserId) {
      this.isOwnProfile = this.user.id === this.currentUserId;
    } else {
      this.isOwnProfile = false;
    }
  }


  openEditForm(): void {

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


  onEditSubmit(formData: ProfileUpdateDto): void {
    this.userService.updateProfile(this.user.id, formData).subscribe({
      next: () => {
        this.showEditForm = false;
        this.loadProfile();
        if (this.isOwnProfile) this.authService.refreshUserProfile();
      },
      error: (err) => this.notification.showError('Ошибка: ' + err.message)
    });
  }

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
      this.router.navigate(['/universities-details', this.user.universityId]);
    }
  }

  onCompetitionClick(competitionId: number): void {
    this.router.navigate(['/competition-details', competitionId]);
  }

  onTraineeClick(traineeId: number): void {
    this.router.navigate(['/profile', traineeId]);
  }

  onCoachClick(): void {
    if (this.user.coachId) {
      this.router.navigate(['/profile', this.user.coachId]);
    }
  }

  onBack(): void {
    window.history.back();
  }


  openPasswordForm(): void {
    this.showPasswordForm = true;
  }

  onPasswordSubmit(formData: PasswordChangeDto): void {
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

  onRankSubmit(formData: any): void {

    const payload: SportRankAssignmentDto = {
      ...formData,
      userId: this.user.id
    };
    console.log('Отправляем на бэкенд:', payload);


    this.userService.assignSportRank(payload).subscribe({
      next: () => {

        this.showRankForm = false;
        this.notification.showSuccess('Спортивный разряд успешно назначен!');


        this.loadProfile(this.user.id.toString());
      },
      error: (err) => {
        console.error(err);
        this.notification.showError('Ошибка при назначении разряда: ' + (err.error?.message || err.message));
      }
    });
  }

  handleImageError(event: any) {
    event.target.src = this.DEFAULT_AVATAR;
  }

  getRoleLabel(role: string): string {
    return ROLE_LABELS[role] || 'Пользователь';
  }

  getGenderLabel(gender: string): string {
    return GENDER_LABELS[gender] || gender;
  }

  getMemberAvatar(imageLink: string | null): string {
    if (!imageLink) return this.DEFAULT_AVATAR;
    if (imageLink.startsWith('http')) return imageLink;
    return this.API_CONFIG.BASE_URL + imageLink;
  }

  onAdminPanel(): void {
    this.router.navigate(['/admin-panel']);
  }

  protected readonly API_URLS = API_URLS;
  protected readonly API_CONFIG = API_CONFIG;
  readonly DEFAULT_AVATAR = '/assets/images/avatar-placeholder.png';
}
