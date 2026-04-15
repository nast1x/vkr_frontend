import {Component, inject, OnInit} from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {NotificationService} from '../../services/notification.service';
import {DynamicFormComponent} from "../dynamic-form/dynamic-form.component";
import {FormField} from '../../models/form.model';
import {University} from '../../models/university.model';
import {EducationPlace, Major} from '../../models/education.model';
import {SportRank, SportType} from '../../models/sport.model';
import {Achievement} from '../../models/achievement.model';
import {AdminService} from '../../services/admin.service';


import {ADMIN_TABS_CONFIG, AdminTabConfig} from './admin-panel.config';
import {NgOptimizedImage} from "@angular/common";

export type AdminTab = 'majors' | 'universities' | 'sport-types' | 'sport-ranks' | 'education-places' | 'achievements';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [HeaderComponent, DynamicFormComponent, NgOptimizedImage],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit {
  private adminService = inject(AdminService);
  private notification = inject(NotificationService);

  activeTab: AdminTab = 'majors';


  majors: Major[] = [];
  universities: University[] = [];
  sportTypes: SportType[] = [];
  sportRanks: SportRank[] = [];
  educationPlaces: EducationPlace[] = [];
  achievements: Achievement[] = [];

  isLoading: boolean = true;
  error: string | null = null;
  showForm: boolean = false;


  editingData: Record<string, any> | null = null;

  ngOnInit(): void {
    this.loadData();
  }


  get currentConfig(): AdminTabConfig {
    return ADMIN_TABS_CONFIG[this.activeTab];
  }

  switchTab(tab: AdminTab): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.loadData();
    }
  }

  get currentFormFields(): FormField[] {
    return this.currentConfig.fields;
  }

  get currentFormTitle(): string {
    const config = this.currentConfig;

    const id = this.editingData ? (this.editingData as Record<string, any>)[config.idKey] : null;
    const isEdit = !!id;

    if (this.activeTab === 'education-places') {
      const userName = (this.editingData as any)?.userName || '';
      return isEdit ? `Редактировать обучение: ${userName}` : `Добавить место обучения: ${userName}`;
    }
    return isEdit ? `Редактировать ${config.titleName}` : `Новый/ая ${config.titleName}`;
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;
    const config = this.currentConfig;

    this.adminService.getAll(config.apiUrl).subscribe({
      next: (data: any[]) => {
        (this as any)[config.dataKey] = data;
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

  openEditForm(item: Record<string, any>): void {
    this.editingData = item;
    this.showForm = true;
  }

  onDelete(id: number): void {
    const config = this.currentConfig;

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

  onFormSubmit(formData: Record<string, any>): void {
    const config = this.currentConfig;
    const id = this.editingData ? (this.editingData as Record<string, any>)[config.idKey] : null;
    const isEdit = !!id;

    if (this.activeTab === 'education-places' && formData['roleId']) {
      this.adminService.updateUserRole(formData['userId'], formData['roleId']).subscribe({
        error: () => this.notification.showError('Не удалось обновить роль пользователя.')
      });
    }

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
