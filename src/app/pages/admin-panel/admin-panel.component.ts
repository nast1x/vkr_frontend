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
  idEducationPlace: number | null; // Теперь может быть null
  userId: number;
  userName: string;
  roleId: number;
  userRole: string;           // ДОБАВЛЕНО
  universityId: number | null;
  universityShortName: string;
  universityName?: string;
  majorId: number | null;
  majorCode: string;
  majorName?: string;
  courseYear: number | null;
}

interface Achievement {
  idAchievement: number;
  userId: number;
  userName: string;
  userRole: string;
  sportRankId: number;
  sportRankName: string;
  sportTypeId: number;
  sportTypeName: string;
  dateReceived: string;
}

type AdminTab = 'majors' | 'universities' | 'sport-types' | 'sport-ranks' | 'education-places' | 'achievements';

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
  achievements: Achievement[] = [];

  isLoading: boolean = true;
  error: string | null = null;

  // Управление модальным окном
  showForm: boolean = false;
  editingData: any = null;

  readonly ROLES = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'User' },
    { value: 3, label: 'Coach' },
    { value : 4, label: 'Athlete' }
  ];

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
    { name: 'roleId', label: 'Роль пользователя', type: 'select', options: this.ROLES, required: true },
    { name: 'universityId', label: 'ID ВУЗа', type: 'number', required: true },
    { name: 'majorId', label: 'ID Специальности', type: 'number', required: true },
    { name: 'courseYear', label: 'Курс (от 0 до 6)', type: 'number', required: true }
  ];

  achievementFormFields: FormField[] = [
    { name: 'userId', label: 'ID Пользователя', type: 'number', required: true },
    { name: 'sportTypeId', label: 'ID Вида спорта', type: 'number', required: true },
    { name: 'sportRankId', label: 'ID Разряда', type: 'number', required: true },
    { name: 'dateReceived', label: 'Дата получения', type: 'date', required: true }
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
    if (this.activeTab === 'achievements') return this.achievementFormFields;
    return this.educationPlaceFormFields;
  }

  get currentFormTitle(): string {
    // Проверяем наличие именно ID записи, а не просто editingData
    let id = null;
    if (this.activeTab === 'majors') id = this.editingData?.idMajor;
    else if (this.activeTab === 'universities') id = this.editingData?.idUniversity;
    else if (this.activeTab === 'sport-types') id = this.editingData?.idSportType;
    else if (this.activeTab === 'sport-ranks') id = this.editingData?.idSportRank;
    else if (this.activeTab === 'achievements') id = this.editingData?.idAchievement;
    else if (this.activeTab === 'education-places') id = this.editingData?.idEducationPlace;

    const isEdit = !!id;

    if (this.activeTab === 'majors') return isEdit ? 'Редактировать специальность' : 'Новая специальность';
    if (this.activeTab === 'universities') return isEdit ? 'Редактировать ВУЗ' : 'Новый ВУЗ';
    if (this.activeTab === 'sport-types') return isEdit ? 'Редактировать вид спорта' : 'Новый вид спорта';
    if (this.activeTab === 'sport-ranks') return isEdit ? 'Редактировать разряд' : 'Новый разряд';
    if (this.activeTab === 'achievements') return isEdit ? 'Редактировать достижение' : 'Новое достижение';

    if (this.activeTab === 'education-places') {
      return isEdit ? `Редактировать обучение: ${this.editingData?.userName}` : `Добавить место обучения: ${this.editingData?.userName || ''}`;
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
    } else if (this.activeTab === 'achievements') {
      this.http.get<Achievement[]>(API_URLS.ACHIEVEMENT).subscribe({
        next: (data) => { this.achievements = data; this.isLoading = false; },
        error: () => { this.error = 'Не удалось загрузить достижения'; this.isLoading = false; }
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
    } else if (this.activeTab === 'sport-types'){
      url = `${API_URLS.SPORT_TYPE}/${id}`; name = 'вид спорта';
    } else {
      url = `${API_URLS.ACHIEVEMENT}/${id}`; name = 'достижение';
    }
    if (!id && this.activeTab === 'education-places') {
      this.notification.showError('У этого пользователя еще нет места обучения.');
      return;
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
    let id = null;
    let url = '';

    // Определяем URL и пытаемся получить ID существующей записи
    if (this.activeTab === 'majors') {
      id = this.editingData?.idMajor;
      url = API_URLS.MAJOR;
    } else if (this.activeTab === 'universities') {
      id = this.editingData?.idUniversity;
      url = API_URLS.UNIVERSITY;
    } else if (this.activeTab === 'education-places') {
      // Ищем именно ID записи об обучении. Если его нет — это будет POST.
      id = this.editingData?.idEducationPlace;
      url = API_URLS.EDUCATION_PLACE;
    } else if (this.activeTab === 'achievements') {
      id = this.editingData?.idAchievement;
      url = API_URLS.ACHIEVEMENT;
    } else if (this.activeTab === 'sport-ranks') {
      id = this.editingData?.idSportRank;
      url = API_URLS.SPORT_RANK;
    } else if (this.activeTab === 'sport-types') {
      id = this.editingData?.idSportType;
      url = API_URLS.SPORT_TYPE;
    }

    // Если ID найден, значит мы обновляем существующую запись (PUT).
    // Если ID нет (даже если есть предзаполненный userId) — создаем новую (POST).
    const isEdit = !!id;
    const isEducationTab = this.activeTab === 'education-places';

    // Обновление роли пользователя (выполняется параллельно с сохранением места обучения)
    if (isEducationTab && formData.roleId) {
      const roleUrl = API_URLS.USER_ROLE(formData.userId);
      this.http.patch(roleUrl, null, { params: { roleId: formData.roleId } }).subscribe({
        error: () => this.notification.showError('Не удалось обновить роль пользователя. Возможно, нет прав или роль уже установлена.')
      });
    }

    // Основной запрос для сохранения сущности
    const request = isEdit
      ? this.http.put(`${url}/${id}`, formData)
      : this.http.post(url, formData);

    request.subscribe({
      next: () => {
        this.showForm = false;
        // Перезагружаем данные, чтобы подтянулась и новая роль, и новое место обучения
        this.loadData();
        this.notification.showSuccess(isEdit ? 'Успешно обновлено!' : 'Успешно добавлено!');
      },
      error: () => {
        this.notification.showError(
          isEdit
            ? 'Ошибка при обновлении. Проверьте введенные данные.'
            : 'Ошибка при создании. Проверьте правильность и уникальность данных.'
        );
      }
    });
  }

}
