import { Input, Component } from '@angular/core';
import { Size } from './size.enum';

@Component({
  selector: 'dndgen-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})

export class LoadingComponent {
  constructor() { }

  @Input() isLoading: boolean = true;
  @Input() size: Size = Size.Small;

  public get loadingClass(): string {
    switch(this.size) {
      case Size.Large: return 'dndgen-loading-large';
      case Size.Medium: return 'dndgen-loading-medium';
      case Size.Small:
      default: return 'dndgen-loading-small';
    }
  }

  public get isLarge(): boolean {
    return this.size == Size.Large;
  }
}
