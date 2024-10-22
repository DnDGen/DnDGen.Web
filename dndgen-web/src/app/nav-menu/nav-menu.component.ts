import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'dndgen-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.css'],
    standalone: true,
    imports: [RouterLink]
})
export class NavMenuComponent { }
