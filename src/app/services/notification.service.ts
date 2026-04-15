import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

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

  /**
   * Универсальное уведомлении о ошибке
   * */
  showError(message: string): void {
    this.messageSubject.next({text: message, type: 'error'});
    this.autoClose();
  }

  /**
   * Универсальное уведомлении о успешном завершении операции
   * */
  showSuccess(message: string): void {
    this.messageSubject.next({text: message, type: 'success'});
    this.autoClose();
  }

  /**
   * Универсальное уведомлении для обнуления счётника-уведомления
   * */
  clear(): void {
    this.messageSubject.next(null);
    if (this.timer) clearTimeout(this.timer);
  }

  /**
   * Универсальное метод для скрытия уведомелния
   * */
  private autoClose(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.clear();
    }, 5000);
  }
}
