import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from './navigation-menu/navigation-menu.component';

@Component({
    selector: 'dndgen-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [NavMenuComponent, RouterOutlet]
})
export class AppComponent {
  title = 'DnDGen';
}
