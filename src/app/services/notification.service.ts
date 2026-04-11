import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NotificationMessage {
  text: string;
  type: 'error' | 'success';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSubject = new BehaviorSubject<NotificationMessage | null>(null);
  public message$ = this.messageSubject.asObservable();
  private timer: any;

  showError(message: string): void {
    this.messageSubject.next({ text: message, type: 'error' });
    this.autoClose();
  }

  showSuccess(message: string): void {
    this.messageSubject.next({ text: message, type: 'success' });
    this.autoClose();
  }

  clear(): void {
    this.messageSubject.next(null);
    if (this.timer) clearTimeout(this.timer);
  }

  private autoClose(): void {
    if (this.timer) clearTimeout(this.timer);
    // Окно автоматически закроется через 5 секунд
    this.timer = setTimeout(() => {
      this.clear();
    }, 5000);
  }
}
