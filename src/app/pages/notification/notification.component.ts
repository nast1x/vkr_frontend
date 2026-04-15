import {Component} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  constructor(public notificationService: NotificationService) {
  }

  close(): void {
    this.notificationService.clear();
  }
}
