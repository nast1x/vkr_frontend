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
  @Input() message = 'Загрузка данных...';
}
