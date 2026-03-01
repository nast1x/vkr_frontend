import {Component} from '@angular/core';
import { Router } from '@angular/router';
import {NgForOf} from '@angular/common';
import {HeaderComponent} from "../header/header.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgForOf,
    HeaderComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  // Заглушки данных (будут загружаться из БД)
  user = {
    avatar: '/assets/images/man-cycling.png',
    fullName: 'Иванов Алексей Петрович',
    role: 'Спортсмен',
    age: 20,
    university: 'МГУ им. М.В. Ломоносова',
    faculty: 'Факультет физической культуры',
    course: 3,
    coach: 'Петров Сергей Владимирович',
    sport: 'Плавание',
    category: 'КМС',
    records: [
      {
        discipline: '50 метров вольный стиль',
        time: '25,8 с',
        date: '10.02.2024'
      },
      {
        discipline: '100 метров вольный стиль',
        time: '56,3 с',
        date: '25.01.2024'
      },
      {
        discipline: '200 метров вольный стиль',
        time: '2:05,4 мин',
        date: '15.12.2023'
      },
      {
        discipline: '50 метров брасс',
        time: '30,2 с',
        date: '05.12.2023'
      },
      {
        discipline: '100 метров на спине',
        time: '1:02,5 мин',
        date: '20.11.2023'
      }
    ]
  };

  constructor(private router: Router) {}

  onProfile(): void {
    // Уже на странице профиля
  }

  onEdit(): void {
    console.log('Редактировать профиль');
    // Логика редактирования
  }
}
