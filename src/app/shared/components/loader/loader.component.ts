import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>{{ message }}</p>
    </div>
  `
})
export class LoaderComponent {
  // Позволяет передавать свой текст загрузки, но по умолчанию будет этот
  @Input() message = 'Загрузка данных...';
}
