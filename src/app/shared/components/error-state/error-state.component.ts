import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  template: `
    <div class="error-state">
      <p>{{ message }}</p>
      <button class="retry-btn" (click)="onRetry()">Попробовать снова</button>
    </div>
  `
})
export class ErrorStateComponent {
  @Input() message = 'Произошла ошибка';
  @Output() retry = new EventEmitter<void>();

  onRetry() {
    this.retry.emit();
  }
}
