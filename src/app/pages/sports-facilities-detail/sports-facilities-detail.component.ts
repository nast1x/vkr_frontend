import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";

import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { API_URLS } from '../../config/api.config';
import { DynamicFormComponent } from "../dynamic-form/dynamic-form.component";
import { AuthService } from "../../services/auth.service";
import {FormField} from "../../models/form.model";

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
  imageLink: string;
  description: string;
  sportsList: string[];
  competitions: Competition[];
  records: Record[];
}

@Component({
  selector: 'app-sports-facilities-detail',
  standalone: true,
  imports: [HeaderComponent, DynamicFormComponent],
  templateUrl: './sports-facilities-detail.component.html',
  styleUrl: './sports-facilities-detail.component.scss'
})
export class SportsFacilitiesDetailComponent implements OnInit {
  facility!: SportsFacility;
  isLoading: boolean = true;
  error: string | null = null;
  isAdmin: boolean = false;
  showEditForm: boolean = false;

  // Объект для передачи начальных данных в форму
  editData: any = {};

  // Заменяем address на street и streetNumber
  editFields: FormField[] = [
    { name: 'name', label: 'Название объекта', type: 'text', required: true },
    { name: 'city', label: 'Город', type: 'text', required: true },
    { name: 'street', label: 'Улица', type: 'text', required: true },
    { name: 'streetNumber', label: 'Номер дома/строения', type: 'text', required: true },
    { name: 'description', label: 'Описание', type: 'textarea' },
    { name: 'imageLink', label: 'Ссылка на фото', type: 'text' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = user?.role === 'Admin';
    });
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

    this.http.get<SportsFacility>(`${API_URLS.SPORT_FACILITIES_LIST}/${facilityId}`)
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

  // Новый метод для подготовки данных и открытия формы
  openEditForm(): void {
    let parsedStreet = '';
    let parsedStreetNumber = '';

    // Разделяем строку "Улица, д. Номер" по разделителю ", д. "
    if (this.facility?.address) {
      const parts = this.facility.address.split(', д. ');
      parsedStreet = parts[0] || '';
      parsedStreetNumber = parts[1] || '';
    }

    // Собираем объект, который идеально ляжет в поля DynamicFormComponent
    this.editData = {
      ...this.facility,
      street: parsedStreet,
      streetNumber: parsedStreetNumber
    };

    this.showEditForm = true;
  }

  onEditSubmit(formData: any): void {
    const facilityId = this.route.snapshot.paramMap.get('id');

    this.http.put(`${API_URLS.SPORT_FACILITIES}/${facilityId}`, formData).subscribe({
      next: () => {
        this.showEditForm = false;
        // Перезагружаем объект, бэкенд снова вернет нам красиво склеенный address
        this.loadFacility();
      },
      error: (err) => alert('Ошибка при сохранении: ' + err.message)
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
