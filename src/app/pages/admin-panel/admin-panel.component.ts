import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { API_URLS } from '../../config/api.config';
import { NotificationService } from '../../services/notification.service';
import { DynamicFormComponent } from "../dynamic-form/dynamic-form.component";
import { FormField } from '../../models/form.model';
import { University } from '../../models/university.model';
import { Major, EducationPlace } from '../../models/education.model';
import { SportType, SportRank } from '../../models/sport.model';
import { Achievement } from '../../models/achievement.model';
import { AdminService } from '../../services/admin.service';
import {
  MAJOR_FORM_FIELDS, UNIVERSITY_FORM_FIELDS, SPORT_TYPE_FORM_FIELDS,
  SPORT_RANK_FORM_FIELDS, EDUCATION_PLACE_FORM_FIELDS, ACHIEVEMENT_FORM_FIELDS
} from './admin-panel.config';

export type AdminTab = 'majors' | 'universities' | 'sport-types' | 'sport-ranks' | 'education-places' | 'achievements';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [HeaderComponent, DynamicFormComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit {
  private adminService = inject(AdminService);
  private notification = inject(NotificationService);

  activeTab: AdminTab = 'majors';

  // Данные
  majors: Major[] = [];
  universities: University[] = [];
  sportTypes: SportType[] = [];
  sportRanks: SportRank[] = [];
  educationPlaces: EducationPlace[] = [];
  achievements: Achievement[] = [];

  isLoading: boolean = true;
  error: string | null = null;
  showForm: boolean = false;
  editingData: any = null;

  // Единый словарь конфигурации для всех вкладок (заменяет все if/else)
  get tabConfig() {
    return {
      'majors': {
        titleName: 'специальность',
        idKey: 'idMajor',
        apiUrl: API_URLS.MAJOR,
        fields: MAJOR_FORM_FIELDS,
        setData: (data: Major[]) => this.majors = data
      },
      'universities': {
        titleName: 'ВУЗ',
        idKey: 'idUniversity',
        apiUrl: API_URLS.UNIVERSITY,
        fields: UNIVERSITY_FORM_FIELDS,
        setData: (data: University[]) => this.universities = data
      },
      'sport-types': {
        titleName: 'вид спорта',
        idKey: 'idSportType',
        apiUrl: API_URLS.SPORT_TYPE,
        fields: SPORT_TYPE_FORM_FIELDS,
        setData: (data: SportType[]) => this.sportTypes = data
      },
      'sport-ranks': {
        titleName: 'разряд',
        idKey: 'idSportRank',
        apiUrl: API_URLS.SPORT_RANK,
        fields: SPORT_RANK_FORM_FIELDS,
        setData: (data: SportRank[]) => this.sportRanks = data
      },
      'education-places': {
        titleName: 'место обучения',
        idKey: 'idEducationPlace',
        apiUrl: API_URLS.EDUCATION_PLACE,
        fields: EDUCATION_PLACE_FORM_FIELDS,
        setData: (data: EducationPlace[]) => this.educationPlaces = data
      },
      'achievements': {
        titleName: 'достижение',
        idKey: 'idAchievement',
        apiUrl: API_URLS.ACHIEVEMENT,
        fields: ACHIEVEMENT_FORM_FIELDS,
        setData: (data: Achievement[]) => this.achievements = data
      }
    };
  }

  ngOnInit(): void {
    this.loadData();
  }

  switchTab(tab: AdminTab): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.loadData();
    }
  }

  // Динамически отдаем нужные поля
  get currentFormFields(): FormField[] {
    return this.tabConfig[this.activeTab].fields;
  }

  // Динамически формируем заголовок
  get currentFormTitle(): string {
    const config = this.tabConfig[this.activeTab];
    const id = this.editingData ? this.editingData[config.idKey] : null;
    const isEdit = !!id;

    if (this.activeTab === 'education-places') {
      return isEdit
        ? `Редактировать обучение: ${this.editingData?.userName}`
        : `Добавить место обучения: ${this.editingData?.userName || ''}`;
    }
    return isEdit ? `Редактировать ${config.titleName}` : `Новый/ая ${config.titleName}`;
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;
    const config = this.tabConfig[this.activeTab];

    this.adminService.getAll(config.apiUrl).subscribe({
      next: (data: any) => {
        config.setData(data);
        this.isLoading = false;
      },
      error: () => {
        this.error = `Не удалось загрузить данные (${config.titleName})`;
        this.isLoading = false;
      }
    });
  }

  openCreateForm(): void {
    this.editingData = null;
    this.showForm = true;
  }

  openEditForm(item: any): void {
    this.editingData = item;
    this.showForm = true;
  }

  onDelete(id: number): void {
    const config = this.tabConfig[this.activeTab];

    if (!id && this.activeTab === 'education-places') {
      this.notification.showError('У этого пользователя еще нет места обучения.');
      return;
    }

    if (confirm(`Вы уверены, что хотите удалить ${config.titleName}?`)) {
      this.adminService.delete(config.apiUrl, id).subscribe({
        next: () => {
          this.loadData();
          this.notification.showSuccess('Успешно удалено.');
        },
        error: () => this.notification.showError('Ошибка удаления: возможно, есть связанные данные.')
      });
    }
  }

  onFormSubmit(formData: any): void {
    const config = this.tabConfig[this.activeTab];
    const id = this.editingData ? this.editingData[config.idKey] : null;
    const isEdit = !!id;

    // Обновление роли пользователя (специфика вкладки места обучения)
    if (this.activeTab === 'education-places' && formData.roleId) {
      this.adminService.updateUserRole(formData.userId, formData.roleId).subscribe({
        error: () => this.notification.showError('Не удалось обновить роль пользователя.')
      });
    }

    // Выбираем метод (PUT или POST)
    const request$ = isEdit
      ? this.adminService.update(config.apiUrl, id, formData)
      : this.adminService.create(config.apiUrl, formData);

    request$.subscribe({
      next: () => {
        this.showForm = false;
        this.loadData();
        this.notification.showSuccess(isEdit ? 'Успешно обновлено!' : 'Успешно добавлено!');
      },
      error: () => {
        this.notification.showError(
          isEdit ? 'Ошибка при обновлении. Проверьте введенные данные.'
            : 'Ошибка при создании. Проверьте правильность и уникальность данных.'
        );
      }
    });
  }
}
