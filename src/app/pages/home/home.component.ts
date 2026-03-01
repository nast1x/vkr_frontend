import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Статистика
  stats = {
    athletes: 0,
    sports: 0,
    results: 0,
    competitions: 0
  };

  // Целевые значения
  targetStats = {
    athletes: 150,
    sports: 25,
    results: 500,
    competitions: 50
  };

  ngOnInit(): void {
    this.animateStats();
  }

  animateStats(): void {
    // Анимируем каждое значение
    this.animateValue('athletes', 0, this.targetStats.athletes, 2000);
    this.animateValue('sports', 0, this.targetStats.sports, 2000);
    this.animateValue('results', 0, this.targetStats.results, 2000);
    this.animateValue('competitions', 0, this.targetStats.competitions, 2000);
  }

  animateValue(statKey: keyof typeof this.stats, start: number, end: number, duration: number): void {
    const startTime = Date.now();

    const updateValue = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Эффект easing
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * (end - start) + start);

      this.stats[statKey] = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    requestAnimationFrame(updateValue);
  }
}
