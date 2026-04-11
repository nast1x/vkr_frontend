import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { HttpClient } from "@angular/common/http";
import { API_URLS } from '../../config/api.config';
import { NotificationService } from '../../services/notification.service';
import {DynamicFormComponent, FormField} from "../dynamic-form/dynamic-form.component";

interface Major {
  idMajor: number;
  name: string;
  code: string;
  description: string;
}

// Новый интерфейс для ВУЗа
interface University {
  idUniversity: number;
  name: string;
  shortName: string;
  city: string;
  description: string;
  imageLink: string;
}

interface SportType {
  idSportType: number;
  name: string;
  description: string;
}
interface SportRank {
  idSportRank: number;
  name: string;
  description: string;
}
interface EducationPlace {
  idEducationPlace: number;
  userId: number;
  userName: string;           // Добавлено
  universityId: number;
  universityShortName: string; // Добавлено
  universityName?: string;
  majorId: number;
  majorCode: string;          // Добавлено
  majorName?: string;
  courseYear: number | null;  // Разрешаем null
}


type AdminTab = 'majors' | 'universities' | 'sport-types' | 'sport-ranks' | 'education-places';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [HeaderComponent, DynamicFormComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit {
  activeTab: AdminTab = 'majors'; // Вкладка по умолчанию

  // Данные
  majors: Major[] = [];
  universities: University[] = [];
  sportTypes: SportType[] = [];
  sportRanks: SportRank[] = [];
  educationPlaces: EducationPlace[] = [];

  isLoading: boolean = true;
  error: string | null = null;

  // Управление модальным окном
  showForm: boolean = false;
  editingData: any = null;

  majorFormFields: FormField[] = [
    { name: 'name', label: 'Название специальности', type: 'text', required: true },
    { name: 'code', label: 'Код специальности (напр. 09.03.01)', type: 'text', required: true },
    { name: 'description', label: 'Описание', type: 'textarea' }
  ];

  universityFormFields: FormField[] = [
    { name: 'name', label: 'Полное название ВУЗа', type: 'text', required: true },
    { name: 'shortName', label: 'Аббревиатура', type: 'text', required: true },
    { name: 'city', label: 'Город', type: 'text', required: true },
    { name: 'description', label: 'Описание', type: 'textarea' },
    { name: 'imageLink', label: 'Ссылка на фото', type: 'text' }
  ];

  sportTypeFormFields: FormField[] = [
    { name: 'name', label: 'Название вида спорта', type: 'text', required: true },
    { name: 'description', label: 'Описание', type: 'textarea' }
  ];

  sportRankFormFields: FormField[] = [
    { name: 'name', label: 'Название разряда', type: 'text', required: true },
    { name: 'description', label: 'Описание', type: 'textarea' }
  ];

  educationPlaceFormFields: FormField[] = [
    { name: 'userId', label: 'ID Пользователя', type: 'number', required: true },
    { name: 'universityId', label: 'ID ВУЗа', type: 'number', required: true },
    { name: 'majorId', label: 'ID Специальности', type: 'number', required: true },
    { name: 'courseYear', label: 'Курс (от 0 до 6)', type: 'number', required: true }
  ];

  constructor(
    private http: HttpClient,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // Смена вкладки
  switchTab(tab: AdminTab): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.loadData();
    }
  }

  // Динамически отдаем нужные поля для открытой формы
  get currentFormFields(): FormField[] {
    if (this.activeTab === 'majors') return this.majorFormFields;
    if (this.activeTab === 'universities') return this.universityFormFields;
    if (this.activeTab === 'sport-types') return this.sportTypeFormFields;
    if (this.activeTab === 'sport-ranks') return this.sportRankFormFields;
    return this.educationPlaceFormFields;
  }

  get currentFormTitle(): string {
    const isEdit = !!this.editingData;
    if (this.activeTab === 'majors') return isEdit ? 'Редактировать специальность' : 'Новая специальность';
    if (this.activeTab === 'universities') return isEdit ? 'Редактировать ВУЗ' : 'Новый ВУЗ';
    if (this.activeTab === 'sport-types') return isEdit ? 'Редактировать вид спорта' : 'Новый вид спорта';
    if (this.activeTab === 'sport-ranks') return isEdit ? 'Редактировать разряд' : 'Новый разряд';

    // Для мест обучения выводим имя пользователя в заголовок
    if (this.activeTab === 'education-places') {
      return isEdit ? `Редактировать обучение: ${this.editingData.userName}` : 'Добавить место обучения';
    }
    return 'Редактирование';
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;

    if (this.activeTab === 'majors') {
      this.http.get<Major[]>(API_URLS.MAJOR).subscribe({
        next: (data) => { this.majors = data; this.isLoading = false; },
        error: () => { this.error = 'Не удалось загрузить специальности'; this.isLoading = false; }
      });
    } else if (this.activeTab === 'universities') {
      this.http.get<University[]>(API_URLS.UNIVERSITY).subscribe({
        next: (data) => { this.universities = data; this.isLoading = false; },
        error: () => { this.error = 'Не удалось загрузить список ВУЗов'; this.isLoading = false; }
      });
    } else if (this.activeTab === 'education-places') {
      this.http.get<EducationPlace[]>(API_URLS.EDUCATION_PLACE).subscribe({
        next: (data) => { this.educationPlaces = data; this.isLoading = false; },
        error: () => { this.error = 'Не удалось загрузить места обучения'; this.isLoading = false; }
      });
    } else if (this.activeTab === 'sport-types') { // Загрузка видов спорта
      this.http.get<SportType[]>(API_URLS.SPORT_TYPE).subscribe({
        next: (data) => {
          this.sportTypes = data;
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Не удалось загрузить виды спорта';
          this.isLoading = false;
        }
      });
    } else if (this.activeTab === 'sport-ranks') {
      this.http.get<SportRank[]>(API_URLS.SPORT_RANK).subscribe({
        next: (data) => { this.sportRanks = data; this.isLoading = false; },
        error: () => { this.error = 'Не удалось загрузить разряды'; this.isLoading = false; }
      });
    }
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
    let url = '';
    let name = '';

    if (this.activeTab === 'majors') {
      url = `${API_URLS.MAJOR}/${id}`; name = 'специальность';
    } else if (this.activeTab === 'universities') {
      url = `${API_URLS.UNIVERSITY}/${id}`; name = 'ВУЗ';
    } else if (this.activeTab === 'education-places') {
      url = `${API_URLS.EDUCATION_PLACE}/${id}`; name = 'место обучения';
    } else if (this.activeTab === 'sport-ranks') {
      url = `${API_URLS.SPORT_RANK}/${id}`; name = 'разряд';
    }
    else {
      url = `${API_URLS.SPORT_TYPE}/${id}`; name = 'вид спорта';
    }
    if (confirm(`Вы уверены, что хотите удалить ${name}?`)) {
      this.http.delete(url).subscribe({
        next: () => {
          this.loadData();
          this.notification.showSuccess('Успешно удалено.');
        },
        error: () => this.notification.showError('Ошибка удаления: возможно, есть связанные данные.')
      });
    }
  }

  onFormSubmit(formData: any): void {
    const isEdit = !!this.editingData;
    let id = null;
    let url = '';
    if (this.activeTab === 'majors') {
      id = isEdit ? this.editingData.idMajor : null;
      url = API_URLS.MAJOR;
    } else if (this.activeTab === 'universities') {
      id = isEdit ? this.editingData.idUniversity : null;
      url = API_URLS.UNIVERSITY;
    } else if (this.activeTab === 'education-places') {
      // Поддержка обоих вариантов ID (в зависимости от DTO бэкенда)
      id = isEdit ? (this.editingData.idEducationPlace || this.editingData.id) : null;
      url = API_URLS.EDUCATION_PLACE;
    } else if (this.activeTab === 'sport-ranks') {
      id = isEdit ? this.editingData.idSportRank : null;
      url = API_URLS.SPORT_RANK;
    }
    else {
      id = isEdit ? this.editingData.idSportType : null;
      url = API_URLS.SPORT_TYPE;
    }
    if (isEdit) {
      this.http.put(`${url}/${id}`, formData).subscribe({
        next: () => {
          this.showForm = false;
          this.loadData();
          this.notification.showSuccess('Успешно обновлено!');
        },
        error: () => this.notification.showError('Ошибка при обновлении. Проверьте введенные данные.')
      });
    } else {
      this.http.post(url, formData).subscribe({
        next: () => {
          this.showForm = false;
          this.loadData();
          this.notification.showSuccess('Успешно добавлено!');
        },
        error: () => this.notification.showError('Ошибка при создании. Проверьте уникальность данных.')
      });
    }
  }
}
