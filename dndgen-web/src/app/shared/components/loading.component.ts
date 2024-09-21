import { Input, Component } from '@angular/core';

@Component({
  selector: 'dndgen-loading',
  templateUrl: './loading.component.html',
})

export class LoadingComponent {
  constructor() { }

  @Input() isLoading: boolean = true;
}
