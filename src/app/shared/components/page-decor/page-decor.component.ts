import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-page-decor',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <aside class="page-decor">
      <img [ngSrc]="imagePath" [alt]="altText" class="decor-image" height="281" width="500">
    </aside>
  `
})
export class PageDecorComponent {
  @Input() imagePath = '/assets/images/mountain-biking.png';
  @Input() altText = 'Decoration';
}
